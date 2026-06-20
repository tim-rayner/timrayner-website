"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ProjectTile } from "@/features/projects/ProjectTile";
import { useModal } from "@/features/projects/ModalProvider";
import type { Project, ProjectAccent, ProjectStatus } from "@/features/projects/data/projects";

const STATUS_PALETTE: Record<ProjectStatus, ProjectAccent> = {
  wip: "primary",
  live: "success",
  concept: "info",
};

interface Props {
  projects: Project[];
}

export function ChatProjectTiles({ projects }: Props) {
  const theme = useTheme();
  const { openProjectModal } = useModal();

  function getAccentColor(project: Project): string {
    return (theme.palette[STATUS_PALETTE[project.status]] as { main: string }).main;
  }

  return (
    <AnimatePresence initial={false}>
      {projects.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 1.5,
            mt: 1.5,
          }}
        >
          {projects.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                delay: idx * 0.07,
                duration: 0.28,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProjectTile
                project={p}
                index={idx}
                accentColor={getAccentColor(p)}
                onOpen={(project) => openProjectModal(project, getAccentColor(project))}
                onContextMenu={() => {}}
              />
            </motion.div>
          ))}
        </Box>
      )}
    </AnimatePresence>
  );
}
