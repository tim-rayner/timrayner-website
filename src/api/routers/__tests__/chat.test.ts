import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockCreate, mockEmbeddingsCreate, mockDbExecute } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockEmbeddingsCreate: vi.fn(),
  mockDbExecute: vi.fn(),
}));

vi.mock("openai", () => ({
  default: class MockOpenAI {
    embeddings = { create: mockEmbeddingsCreate };
    chat = { completions: { create: mockCreate } };
  },
}));

vi.mock("@/db", () => ({
  db: { execute: mockDbExecute },
}));

import { createCallerFactory } from "@/api/trpc";
import { appRouter } from "@/api/root";

const createCaller = createCallerFactory(appRouter);
const caller = createCaller({});

const MOCK_EMBEDDING = Array.from({ length: 1536 }, (_, i) => i * 0.001);

function setupHappyPath({
  answer = "Tim has used tRPC.",
  verdict = "YES" as const,
  projectIds = ["structura"],
  chunks = [
    {
      content: "Structura uses tRPC for its API layer.",
      metadata: { projectId: "structura", title: "Structura" },
      similarity: 0.85,
    },
  ],
} = {}) {
  mockEmbeddingsCreate.mockResolvedValue({
    data: [{ embedding: MOCK_EMBEDDING }],
  });
  mockDbExecute.mockResolvedValue(chunks);
  mockCreate.mockResolvedValue({
    choices: [{ message: { content: JSON.stringify({ answer, verdict, projectIds }) } }],
  });
}

describe("chat.ask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Input validation ────────────────────────────────────────────────────

  it("throws on an empty message", async () => {
    await expect(caller.chat.ask({ message: "" })).rejects.toThrow();
  });

  it("throws when message exceeds 500 characters", async () => {
    await expect(caller.chat.ask({ message: "a".repeat(501) })).rejects.toThrow();
  });

  it("throws when history exceeds 10 items", async () => {
    const history = Array.from({ length: 11 }, (_, i) => ({
      role: "user" as const,
      content: `msg ${i}`,
    }));
    await expect(caller.chat.ask({ message: "test", history })).rejects.toThrow();
  });

  it("accepts a message at exactly the 500-character limit", async () => {
    setupHappyPath();
    await expect(caller.chat.ask({ message: "a".repeat(500) })).resolves.not.toThrow();
  });

  it("accepts history with exactly 10 items", async () => {
    setupHappyPath();
    const history = Array.from({ length: 10 }, (_, i) => ({
      role: "user" as const,
      content: `msg ${i}`,
    }));
    await expect(caller.chat.ask({ message: "test", history })).resolves.not.toThrow();
  });

  // ─── Happy path ──────────────────────────────────────────────────────────

  it("returns answer, verdict, and hydrated projects", async () => {
    setupHappyPath();
    const result = await caller.chat.ask({ message: "Has Tim used tRPC?" });
    expect(result.answer).toBe("Tim has used tRPC.");
    expect(result.verdict).toBe("YES");
    expect(result.projects).toHaveLength(1);
    expect(result.projects[0].id).toBe("structura");
  });

  it("returns fully hydrated project objects (not partial data)", async () => {
    setupHappyPath();
    const result = await caller.chat.ask({ message: "Has Tim used tRPC?" });
    const project = result.projects[0];
    expect(project).toHaveProperty("name");
    expect(project).toHaveProperty("tech");
    expect(project).toHaveProperty("status");
  });

  it("returns empty projects for a NONE verdict", async () => {
    setupHappyPath({ answer: "Structura is a BIM QA tool.", verdict: "NONE", projectIds: [] });
    const result = await caller.chat.ask({ message: "What is Structura?" });
    expect(result.verdict).toBe("NONE");
    expect(result.projects).toHaveLength(0);
  });

  it("returns empty projects when model sends no project IDs", async () => {
    setupHappyPath({ projectIds: [] });
    const result = await caller.chat.ask({ message: "Tell me about Tim." });
    expect(result.projects).toHaveLength(0);
  });

  // ─── Project security filtering ─────────────────────────────────────────

  it("strips model-returned IDs that are not in the candidate set", async () => {
    setupHappyPath({ projectIds: ["structura", "injected-hallucination"] });
    const result = await caller.chat.ask({ message: "Has Tim used tRPC?" });
    const ids = result.projects.map((p) => p.id);
    expect(ids).toContain("structura");
    expect(ids).not.toContain("injected-hallucination");
  });

  it("returns no projects when all model IDs are outside the candidate set", async () => {
    setupHappyPath({ projectIds: ["fake-1", "fake-2"] });
    const result = await caller.chat.ask({ message: "Has Tim used tRPC?" });
    expect(result.projects).toHaveLength(0);
  });

  // ─── OpenAI interaction ──────────────────────────────────────────────────

  it("embeds the user message with text-embedding-3-small", async () => {
    setupHappyPath();
    await caller.chat.ask({ message: "Does Tim know React?" });
    expect(mockEmbeddingsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "text-embedding-3-small",
        input: "Does Tim know React?",
      })
    );
  });

  it("passes conversation history to the chat completion", async () => {
    setupHappyPath();
    await caller.chat.ask({
      message: "Follow-up question",
      history: [
        { role: "user", content: "Has Tim used React?" },
        { role: "assistant", content: "Yes, Tim has used React." },
      ],
    });
    const messages = mockCreate.mock.calls[0][0].messages as Array<{
      role: string;
      content: string;
    }>;
    expect(messages.some((m) => m.role === "user" && m.content === "Has Tim used React?")).toBe(
      true
    );
    expect(
      messages.some((m) => m.role === "assistant" && m.content === "Yes, Tim has used React.")
    ).toBe(true);
  });

  it("uses gpt-4o-mini for the chat completion", async () => {
    setupHappyPath();
    await caller.chat.ask({ message: "test" });
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ model: "gpt-4o-mini" }));
  });

  it("requests json_object response format", async () => {
    setupHappyPath();
    await caller.chat.ask({ message: "test" });
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ response_format: { type: "json_object" } })
    );
  });

  // ─── Tech-tag sweep ──────────────────────────────────────────────────────

  it("includes tech-tag-matched projects even when they have no chunk hits", async () => {
    // No chunk hits (empty DB result), but "react" in query triggers tech sweep
    mockEmbeddingsCreate.mockResolvedValue({ data: [{ embedding: MOCK_EMBEDDING }] });
    mockDbExecute.mockResolvedValue([]);
    // artlist-ai-toolkit has React in its tech list
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              answer: "Yes.",
              verdict: "YES",
              projectIds: ["artlist-ai-toolkit"],
            }),
          },
        },
      ],
    });
    const result = await caller.chat.ask({ message: "Has Tim used react?" });
    const ids = result.projects.map((p) => p.id);
    expect(ids).toContain("artlist-ai-toolkit");
  });

  // ─── Empty context fallback ──────────────────────────────────────────────

  it("still calls the chat completion when no chunks match", async () => {
    mockEmbeddingsCreate.mockResolvedValue({ data: [{ embedding: MOCK_EMBEDDING }] });
    mockDbExecute.mockResolvedValue([]);
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({ answer: "I don't know.", verdict: "NONE", projectIds: [] }),
          },
        },
      ],
    });
    const result = await caller.chat.ask({ message: "What is Tim's favourite colour?" });
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(result.answer).toBe("I don't know.");
  });
});
