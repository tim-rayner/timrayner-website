import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Project } from "@/features/projects/data/projects";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// framer-motion: replace AnimatePresence with a passthrough so exit animations
// don't keep elements in the DOM during tests.
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: React.forwardRef(
      (
        { children, style, className }: { children?: React.ReactNode; style?: React.CSSProperties; className?: string; [k: string]: unknown },
        ref: React.Ref<HTMLDivElement>
      ) => (
        <div ref={ref} style={style} className={className}>
          {children}
        </div>
      )
    ),
  },
}));

type MutationOpts = {
  onSuccess?: (res: { answer: string; verdict: "YES" | "NO" | "PARTIAL" | "NONE"; projects: Project[] }) => void;
};

const mockStateRef = vi.hoisted(() => ({
  isPending: false as boolean,
  error: null as Error | null,
  capturedOnSuccess: undefined as MutationOpts["onSuccess"],
}));

const mockMutate = vi.hoisted(() => vi.fn());

vi.mock("@/lib/trpc", () => ({
  trpc: {
    chat: {
      ask: {
        useMutation: (opts: MutationOpts) => {
          mockStateRef.capturedOnSuccess = opts?.onSuccess;
          return {
            mutate: mockMutate,
            isPending: mockStateRef.isPending,
            error: mockStateRef.error,
          };
        },
      },
    },
  },
}));

vi.mock("../ChatProjectTiles", () => ({
  ChatProjectTiles: ({ projects }: { projects: Project[] }) => (
    <div data-testid="project-tiles">{projects.length} projects</div>
  ),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

import { ChatClient } from "../ChatClient";

function triggerSuccess(res: { answer: string; verdict: "YES" | "NO" | "PARTIAL" | "NONE"; projects: Project[] }) {
  mockStateRef.capturedOnSuccess?.(res);
}

const sendButton = () => screen.getByRole("button", { name: /send message/i });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ChatClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStateRef.isPending = false;
    mockStateRef.error = null;
    mockStateRef.capturedOnSuccess = undefined;
  });

  // ─── Initial render ────────────────────────────────────────────────────

  it("renders all four suggested prompts initially", () => {
    render(<ChatClient />);
    expect(screen.getByText("Has Tim worked with React Native?")).toBeInTheDocument();
    expect(screen.getByText("What AI/LLM projects has Tim built?")).toBeInTheDocument();
    expect(screen.getByText("Has Tim used Three.js or BIM/IFC?")).toBeInTheDocument();
    expect(screen.getByText("Show me Tim's full-stack projects")).toBeInTheDocument();
  });

  it("renders no transcript before the first message", () => {
    render(<ChatClient />);
    expect(screen.queryByText("Clear chat")).not.toBeInTheDocument();
  });

  it("renders the text input", () => {
    render(<ChatClient />);
    expect(screen.getByPlaceholderText("Ask about Tim's work…")).toBeInTheDocument();
  });

  it("renders the send button", () => {
    render(<ChatClient />);
    expect(sendButton()).toBeInTheDocument();
  });

  // ─── Input state ───────────────────────────────────────────────────────

  it("disables the send button when the input is empty", () => {
    render(<ChatClient />);
    expect(sendButton()).toBeDisabled();
  });

  it("enables the send button when the input has non-whitespace content", () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "Tell me about tRPC" },
    });
    expect(sendButton()).not.toBeDisabled();
  });

  it("disables the send button when input is only whitespace", () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "   " },
    });
    expect(sendButton()).toBeDisabled();
  });

  // ─── Sending a message ─────────────────────────────────────────────────

  it("calls mutate with the trimmed message when the send button is clicked", () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "  tell me about react  " },
    });
    fireEvent.click(sendButton());
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ message: "tell me about react" })
    );
  });

  it("clears the input after sending", () => {
    render(<ChatClient />);
    const input = screen.getByPlaceholderText("Ask about Tim's work…");
    fireEvent.change(input, { target: { value: "question" } });
    fireEvent.click(sendButton());
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("adds the user turn to the transcript after sending", () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "What is Structura?" },
    });
    fireEvent.click(sendButton());
    expect(screen.getByText("What is Structura?")).toBeInTheDocument();
  });

  it("sends a message when Enter is pressed", () => {
    render(<ChatClient />);
    const input = screen.getByPlaceholderText("Ask about Tim's work…");
    fireEvent.change(input, { target: { value: "Enter key test" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  it("does not send when Shift+Enter is pressed", () => {
    render(<ChatClient />);
    const input = screen.getByPlaceholderText("Ask about Tim's work…");
    fireEvent.change(input, { target: { value: "multiline text" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("does not send an empty message on Enter", () => {
    render(<ChatClient />);
    const input = screen.getByPlaceholderText("Ask about Tim's work…");
    fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  // ─── Suggested prompts ─────────────────────────────────────────────────

  it("hides suggested prompts after the first message is sent", () => {
    render(<ChatClient />);
    fireEvent.click(screen.getByText("Has Tim worked with React Native?"));
    expect(screen.queryByText("What AI/LLM projects has Tim built?")).not.toBeInTheDocument();
  });

  it("sends the correct message when a suggested prompt chip is clicked", () => {
    render(<ChatClient />);
    fireEvent.click(screen.getByText("Has Tim worked with React Native?"));
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Has Tim worked with React Native?" })
    );
  });

  // ─── Pending / loading state ───────────────────────────────────────────

  it('shows "Thinking…" when isPending is true', () => {
    // "Thinking…" is inside the transcript section which only renders after hasSentOnce.
    // Send once first, then flip isPending and rerender.
    const { rerender } = render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "test" },
    });
    fireEvent.click(sendButton());

    mockStateRef.isPending = true;
    rerender(<ChatClient />);

    expect(screen.getByText("Thinking…")).toBeInTheDocument();
  });

  it("disables the text field when isPending is true", () => {
    mockStateRef.isPending = true;
    render(<ChatClient />);
    expect(screen.getByPlaceholderText("Ask about Tim's work…")).toBeDisabled();
  });

  // ─── Error state ───────────────────────────────────────────────────────

  it("shows an error message when the mutation fails", () => {
    mockStateRef.error = new Error("network error");
    render(<ChatClient />);
    expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });

  // ─── Assistant response ────────────────────────────────────────────────

  it("adds the assistant answer to the transcript on success", async () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "Has Tim used tRPC?" },
    });
    fireEvent.click(sendButton());

    await act(async () => {
      triggerSuccess({ answer: "Yes, Tim has used tRPC.", verdict: "YES", projects: [] });
    });

    expect(screen.getByText("Yes, Tim has used tRPC.")).toBeInTheDocument();
  });

  it("renders the verdict label when verdict is YES", async () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "Has Tim used tRPC?" },
    });
    fireEvent.click(sendButton());

    await act(async () => {
      triggerSuccess({ answer: "Yes.", verdict: "YES", projects: [] });
    });

    expect(screen.getByText(/strong match/i)).toBeInTheDocument();
  });

  it("renders the correct label for NO verdict", async () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "Has Tim used Angular?" },
    });
    fireEvent.click(sendButton());

    await act(async () => {
      triggerSuccess({ answer: "No, Tim hasn't used Angular.", verdict: "NO", projects: [] });
    });

    expect(screen.getByText(/not a fit/i)).toBeInTheDocument();
  });

  it("renders the correct label for PARTIAL verdict", async () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "Has Tim used GraphQL?" },
    });
    fireEvent.click(sendButton());

    await act(async () => {
      triggerSuccess({ answer: "Tim has touched GraphQL briefly.", verdict: "PARTIAL", projects: [] });
    });

    expect(screen.getByText(/partial match/i)).toBeInTheDocument();
  });

  it("does not render a verdict badge for NONE verdict", async () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "What is Structura?" },
    });
    fireEvent.click(sendButton());

    await act(async () => {
      triggerSuccess({ answer: "Structura is a BIM QA tool.", verdict: "NONE", projects: [] });
    });

    expect(screen.queryByText(/strong match|not a fit|partial match/i)).not.toBeInTheDocument();
  });

  it("renders project tiles when the response includes projects", async () => {
    const fakeProject: Project = {
      id: "structura",
      name: "Structura",
      tagline: "BIM QA",
      description: "desc",
      logoChar: "ST",
      accent: "primary",
      status: "wip",
      tech: ["TypeScript"],
    };

    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "tRPC projects?" },
    });
    fireEvent.click(sendButton());

    await act(async () => {
      triggerSuccess({ answer: "Here are some.", verdict: "YES", projects: [fakeProject] });
    });

    expect(screen.getByTestId("project-tiles")).toBeInTheDocument();
    expect(screen.getByTestId("project-tiles").textContent).toBe("1 projects");
  });

  it("passes conversation history on subsequent sends", async () => {
    render(<ChatClient />);

    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "First question" },
    });
    fireEvent.click(sendButton());

    await act(async () => {
      triggerSuccess({ answer: "First answer.", verdict: "YES", projects: [] });
    });

    // Advance past the 1-second debounce window
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1100));
    });

    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "Second question" },
    });
    fireEvent.click(sendButton());

    expect(mockMutate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        message: "Second question",
        history: expect.arrayContaining([
          { role: "user", content: "First question" },
          { role: "assistant", content: "First answer." },
        ]),
      })
    );
  });

  // ─── Clear chat ────────────────────────────────────────────────────────

  it("shows the Clear chat button once a message has been sent", () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "hello" },
    });
    fireEvent.click(sendButton());
    expect(screen.getByText("Clear chat")).toBeInTheDocument();
  });

  it("resets the transcript and restores suggested prompts when Clear chat is clicked", () => {
    render(<ChatClient />);
    fireEvent.change(screen.getByPlaceholderText("Ask about Tim's work…"), {
      target: { value: "hello" },
    });
    fireEvent.click(sendButton());

    fireEvent.click(screen.getByText("Clear chat"));

    expect(screen.queryByText("Clear chat")).not.toBeInTheDocument();
    expect(screen.getByText("Has Tim worked with React Native?")).toBeInTheDocument();
  });

  // ─── Debounce ──────────────────────────────────────────────────────────

  it("prevents a second send within the 1-second debounce window", () => {
    render(<ChatClient />);
    const input = screen.getByPlaceholderText("Ask about Tim's work…");

    fireEvent.change(input, { target: { value: "First" } });
    fireEvent.click(sendButton());

    // Attempt second send immediately — debounce should block it
    fireEvent.change(input, { target: { value: "Second" } });
    fireEvent.click(sendButton());

    expect(mockMutate).toHaveBeenCalledTimes(1);
  });
});
