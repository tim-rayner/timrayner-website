import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { filterProjects } from "../ProjectSearch";
import { ProjectSearch } from "../ProjectSearch";
import { PROJECTS } from "../data/projects";

// ─── filterProjects (pure function) ────────────────────────────────────────

describe("filterProjects", () => {
  it("returns all projects when query and status are empty/all", () => {
    expect(filterProjects(PROJECTS, "")).toHaveLength(PROJECTS.length);
  });

  it("filters by project name case-insensitively", () => {
    const results = filterProjects(PROJECTS, "structura");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Structura");
  });

  it("filters by project tagline", () => {
    const results = filterProjects(PROJECTS, "linkedin");
    expect(results.some((p) => p.id === "nobizz")).toBe(true);
  });

  it("returns empty array when no projects match", () => {
    expect(filterProjects(PROJECTS, "zzznomatchxyz")).toHaveLength(0);
  });

  it("filters by status when status is not 'all'", () => {
    const wip = filterProjects(PROJECTS, "", "wip");
    expect(wip.length).toBeGreaterThan(0);
    expect(wip.every((p) => p.status === "wip")).toBe(true);
  });

  it("applies both query and status filters together", () => {
    // Structura is wip, not live
    const results = filterProjects(PROJECTS, "structura", "live");
    expect(results).toHaveLength(0);
  });

  it("returns wip Structura when query and status both match", () => {
    const results = filterProjects(PROJECTS, "structura", "wip");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Structura");
  });
});

// ─── ProjectSearch (component behaviour) ───────────────────────────────────

describe("ProjectSearch", () => {
  it("renders a search text input", () => {
    render(<ProjectSearch onFilterChange={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls onFilterChange with the typed query and current status", () => {
    const onFilterChange = vi.fn();
    render(<ProjectSearch onFilterChange={onFilterChange} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Structura" },
    });
    expect(onFilterChange).toHaveBeenCalledWith("Structura", "all");
  });

  it("shows a clear button only when the query is non-empty", () => {
    render(<ProjectSearch onFilterChange={() => {}} />);
    expect(
      screen.queryByRole("button", { name: /clear/i })
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "test" },
    });
    expect(
      screen.getByRole("button", { name: /clear/i })
    ).toBeInTheDocument();
  });

  it("clears the query and notifies onFilterChange when clear is clicked", () => {
    const onFilterChange = vi.fn();
    render(<ProjectSearch onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "test" },
    });
    fireEvent.click(screen.getByRole("button", { name: /clear/i }));

    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("");
    expect(onFilterChange).toHaveBeenLastCalledWith("", "all");
  });

  it("renders status filter buttons for All, Live, In Progress, and Concept", () => {
    render(<ProjectSearch onFilterChange={() => {}} />);
    expect(screen.getByRole("button", { name: /^all$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^live$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /in progress/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^concept$/i })
    ).toBeInTheDocument();
  });

  it("calls onFilterChange with the selected status when a filter button is clicked", () => {
    const onFilterChange = vi.fn();
    render(<ProjectSearch onFilterChange={onFilterChange} />);
    fireEvent.click(screen.getByRole("button", { name: /in progress/i }));
    expect(onFilterChange).toHaveBeenCalledWith("", "wip");
  });
});
