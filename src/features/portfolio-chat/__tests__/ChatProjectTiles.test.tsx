import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChatProjectTiles } from "../ChatProjectTiles";
import type { Project } from "@/features/projects/data/projects";

const mockOpenProjectModal = vi.fn();

vi.mock("@/features/projects/ModalProvider", () => ({
  useModal: () => ({
    openProjectModal: mockOpenProjectModal,
    openContactModal: vi.fn(),
    close: vi.fn(),
  }),
}));

vi.mock("@/features/projects/ProjectTile", () => ({
  ProjectTile: ({ project }: { project: Project }) => (
    <div data-testid={`tile-${project.id}`}>{project.name}</div>
  ),
}));

const makeProject = (id: string, overrides: Partial<Project> = {}): Project => ({
  id,
  name: `Project ${id}`,
  tagline: "A tagline",
  description: "A description",
  logoChar: "P",
  accent: "primary",
  status: "live",
  tech: ["TypeScript"],
  ...overrides,
});

describe("ChatProjectTiles", () => {
  it("renders nothing inside the grid when the projects array is empty", () => {
    const { container } = render(<ChatProjectTiles projects={[]} />);
    expect(container.querySelector("[data-testid]")).toBeNull();
  });

  it("renders one tile per project", () => {
    const projects = [makeProject("alpha"), makeProject("beta"), makeProject("gamma")];
    render(<ChatProjectTiles projects={projects} />);
    expect(screen.getByTestId("tile-alpha")).toBeInTheDocument();
    expect(screen.getByTestId("tile-beta")).toBeInTheDocument();
    expect(screen.getByTestId("tile-gamma")).toBeInTheDocument();
  });

  it("renders the project name inside each tile", () => {
    render(<ChatProjectTiles projects={[makeProject("foo")]} />);
    expect(screen.getByText("Project foo")).toBeInTheDocument();
  });

  it("renders a grid container when projects are present", () => {
    const { container } = render(<ChatProjectTiles projects={[makeProject("x")]} />);
    expect(container.querySelector("[data-testid='tile-x']")).toBeInTheDocument();
  });
});
