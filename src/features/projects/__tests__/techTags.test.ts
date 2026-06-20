import { describe, it, expect } from "vitest";
import { PROJECTS } from "@/features/projects/data/projects";

describe("project tech tags", () => {
  it("every project has at least one tech tag", () => {
    for (const p of PROJECTS) {
      expect(p.tech.length, `${p.name} has no tech tags`).toBeGreaterThan(0);
    }
  });
});
