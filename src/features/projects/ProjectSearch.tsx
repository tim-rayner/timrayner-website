"use client";

import { useState } from "react";
import { Box, InputBase, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import type { Project, ProjectStatus } from "./data/projects";

export type ViewMode = "grid" | "list";

export type StatusFilter = ProjectStatus | "all";

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Live", value: "live" },
  { label: "In Progress", value: "wip" },
  { label: "Concept", value: "concept" },
];

export function filterProjects(
  projects: Project[],
  query: string,
  status: StatusFilter = "all"
): Project[] {
  const q = query.trim().toLowerCase();
  return projects.filter((p) => {
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    const matchesStatus = status === "all" || p.status === status;
    return matchesQuery && matchesStatus;
  });
}

interface ProjectSearchProps {
  onFilterChange: (query: string, status: StatusFilter) => void;
  viewMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
  onAddNew?: () => void;
}

export function ProjectSearch({
  onFilterChange,
  viewMode = "grid",
  onViewChange,
  onAddNew,
}: ProjectSearchProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  function handleQueryChange(value: string) {
    setQuery(value);
    onFilterChange(value, status);
  }

  function handleStatusChange(next: StatusFilter) {
    setStatus(next);
    onFilterChange(query, next);
  }

  function handleClear() {
    setQuery("");
    onFilterChange("", status);
  }

  const searchInput = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 1.5,
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "rgba(255,255,255,0.04)",
        flex: 1,
        minWidth: 0,
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        "&:focus-within": {
          borderColor: "rgba(124, 93, 255, 0.4)",
          bgcolor: "rgba(255,255,255,0.06)",
        },
      }}
    >
      <SearchIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
      <InputBase
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        placeholder="Filter projects…"
        inputProps={{ "aria-label": "filter projects" }}
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: "0.8125rem",
          color: "text.primary",
          "& input": { p: 0 },
          "& input::placeholder": { color: "rgba(255,255,255,0.3)", opacity: 1 },
        }}
      />
      {query && (
        <Box
          component="button"
          aria-label="clear"
          onClick={handleClear}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 16,
            height: 16,
            border: "none",
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            p: 0,
            flexShrink: 0,
            transition: "background-color 0.15s ease",
            "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 10 }} />
        </Box>
      )}
    </Box>
  );

  const addNewButton = onAddNew && (
    <Box
      component="button"
      aria-label="Add new project enquiry"
      onClick={onAddNew}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.5,
        height: 34,
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        borderRadius: 1.25,
        border: "1px solid rgba(124,93,255,0.5)",
        bgcolor: "rgba(124,93,255,0.22)",
        color: "#C4B5FD",
        cursor: "pointer",
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: "all 0.16s ease",
        "&:hover": {
          bgcolor: "rgba(124,93,255,0.32)",
          borderColor: "rgba(124,93,255,0.7)",
          color: "#DDD6FE",
        },
        "&:active": { transform: "scale(0.97)" },
      }}
    >
      <NoteAddOutlinedIcon sx={{ fontSize: 14 }} />
      <Typography
        component="span"
        sx={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit", lineHeight: 1 }}
      >
        + Add new
      </Typography>
    </Box>
  );

  const viewToggle = onViewChange && (
    <Box
      sx={{
        display: { xs: "none", sm: "flex" },
        gap: 0.25,
        p: 0.375,
        borderRadius: 1.25,
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "rgba(255,255,255,0.03)",
        flexShrink: 0,
      }}
    >
      {(
        [
          { mode: "grid" as ViewMode, Icon: ViewModuleOutlinedIcon, label: "Grid view" },
          { mode: "list" as ViewMode, Icon: ViewListOutlinedIcon, label: "List view" },
        ] as const
      ).map(({ mode, Icon, label }) => {
        const active = viewMode === mode;
        return (
          <Box
            key={mode}
            component="button"
            aria-label={label}
            onClick={() => onViewChange(mode)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              border: "none",
              borderRadius: 1,
              bgcolor: active ? "rgba(124,93,255,0.2)" : "transparent",
              color: active ? "#B39DFF" : "rgba(255,255,255,0.35)",
              cursor: "pointer",
              p: 0,
              transition: "background-color 0.15s ease, color 0.15s ease",
              "&:hover": {
                bgcolor: active ? "rgba(124,93,255,0.25)" : "rgba(255,255,255,0.07)",
                color: active ? "#B39DFF" : "rgba(255,255,255,0.65)",
              },
            }}
          >
            <Icon sx={{ fontSize: 16 }} />
          </Box>
        );
      })}
    </Box>
  );

  const statusPills = (
    <Box sx={{ display: "flex", gap: 0.75, flexWrap: "nowrap" }}>
      {STATUS_OPTIONS.map(({ label, value }) => {
        const active = status === value;
        return (
          <Box
            key={value}
            component="button"
            aria-label={label}
            onClick={() => handleStatusChange(value)}
            sx={{
              px: 1.25,
              py: 0.5,
              fontSize: "0.75rem",
              fontWeight: active ? 600 : 400,
              letterSpacing: "0.02em",
              borderRadius: 1,
              border: "1px solid",
              borderColor: active ? "rgba(124,93,255,0.5)" : "rgba(255,255,255,0.08)",
              bgcolor: active ? "rgba(124,93,255,0.15)" : "transparent",
              color: active ? "#B39DFF" : "rgba(255,255,255,0.45)",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.15s ease",
              "&:hover": {
                borderColor: "rgba(124,93,255,0.35)",
                color: "rgba(255,255,255,0.75)",
              },
            }}
          >
            <Typography
              component="span"
              sx={{ fontSize: "inherit", fontWeight: "inherit", color: "inherit", lineHeight: 1 }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Row 1: search + add new (always inline) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
        {searchInput}
        {addNewButton}
        {viewToggle}
      </Box>

      {/* Row 2: status pills (+ view toggle on mobile hidden anyway) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {statusPills}
      </Box>
    </Box>
  );
}
