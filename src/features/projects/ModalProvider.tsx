"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Project } from "./data/projects";
import { ContactModal } from "./ContactModal";
import { ProjectModal } from "./ProjectModal";

type ModalState =
  | { type: "project"; project: Project; accentColor: string }
  | { type: "contact" }
  | null;

interface ModalContextValue {
  openProjectModal: (project: Project, accentColor: string) => void;
  openContactModal: () => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null);

  const openProjectModal = useCallback((project: Project, accentColor: string) => {
    setModal({ type: "project", project, accentColor });
  }, []);

  const openContactModal = useCallback(() => {
    setModal({ type: "contact" });
  }, []);

  const close = useCallback(() => setModal(null), []);

  const isOpen = modal !== null;

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  return (
    <ModalContext.Provider value={{ openProjectModal, openContactModal, close }}>
      {children}

      <AnimatePresence>
        {modal?.type === "project" && (
          <ProjectModal
            key={modal.project.id}
            project={modal.project}
            accentColor={modal.accentColor}
            onClose={close}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal?.type === "contact" && (
          <ContactModal key="contact-modal" onClose={close} />
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
