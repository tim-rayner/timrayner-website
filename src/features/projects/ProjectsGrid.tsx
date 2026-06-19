"use client";

import { useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { PROJECTS, type Project, type ProjectAccent, type ProjectStatus } from "./data/projects";
import { filterProjects, type StatusFilter, type ViewMode } from "./ProjectSearch";
import { ProjectSearch } from "./ProjectSearch";
import { ProjectTile } from "./ProjectTile";
import { ProjectContextMenu } from "./ProjectContextMenu";
import { ProjectModal } from "./ProjectModal";

const MotionBox = motion(Box);

interface ContextMenuState {
  project: Project;
  x: number;
  y: number;
}

export function ProjectsGrid() {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>({});
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = filterProjects(PROJECTS, query, status);

  const handleFilterChange = useCallback(
    (q: string, s: StatusFilter) => {
      setQuery(q);
      setStatus(s);
    },
    []
  );

  const handleContextMenu = useCallback(
    (project: Project, x: number, y: number) => {
      setContextMenu({ project, x, y });
    },
    []
  );

  const handleCloseMenu = useCallback(() => setContextMenu(null), []);
  const handleOpenModal = useCallback((project: Project) => setSelectedProject(project), []);
  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  const handleColorChange = useCallback((projectId: string, color: string) => {
    setColorOverrides((prev) => ({ ...prev, [projectId]: color }));
  }, []);

  const STATUS_PALETTE: Record<ProjectStatus, ProjectAccent> = {
    wip: "primary",   // Royal Purple — active, building
    live: "success",  // Cyber Teal — shipped, running
    concept: "info",  // Soft Lilac — ideation
  };

  function getStatusColor(status: ProjectStatus): string {
    return (theme.palette[STATUS_PALETTE[status]] as { main: string }).main;
  }

  return (
    <Box>
      {/* Search + filter bar */}
      <Box sx={{ mb: 3 }}>
        <ProjectSearch
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />
      </Box>

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              viewMode === "list"
                ? "1fr"
                : {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(5, 1fr)",
                  },
            gap: viewMode === "list" ? 0.75 : { xs: 0.75, sm: 1.5 },
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectTile
                key={project.id}
                project={project}
                accentColor={getStatusColor(project.status)}
                colorOverride={colorOverrides[project.id]}
                index={i}
                viewMode={viewMode}
                onContextMenu={handleContextMenu}
                onOpen={handleOpenModal}
              />
            ))}
          </AnimatePresence>
        </Box>
      ) : (
        <MotionBox
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            No projects match
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Try a different search or filter
          </Typography>
        </MotionBox>
      )}

      {/* Context menu portal */}
      <AnimatePresence>
        {contextMenu && (
          <ProjectContextMenu
            project={contextMenu.project}
            position={{ x: contextMenu.x, y: contextMenu.y }}
            activeColor={
              colorOverrides[contextMenu.project.id] ??
              getStatusColor(contextMenu.project.status)
            }
            onClose={handleCloseMenu}
            onColorChange={handleColorChange}
          />
        )}
      </AnimatePresence>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            key={selectedProject.id}
            project={selectedProject}
            accentColor={
              colorOverrides[selectedProject.id] ??
              getStatusColor(selectedProject.status)
            }
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </Box>
  );
}
