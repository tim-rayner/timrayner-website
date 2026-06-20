"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function BackgroundGlow() {
  const { scrollYProgress } = useScroll();

  const purpleX = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const purpleY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const blueX = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const blueY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  return (
    <>
      <style>{`@media (max-width: 767px) { .bg-glow { display: none; } }`}</style>
      <motion.div
        aria-hidden
        className="bg-glow"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: -1,
          overflow: "hidden",
          opacity,
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "55vw",
            height: "55vw",
            maxWidth: 800,
            maxHeight: 800,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(124,93,255,0.13) 0%, transparent 70%)",
            x: purpleX,
            y: purpleY,
            willChange: "transform",
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ scale: { duration: 9, repeat: Infinity, ease: "easeInOut" } }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: "50vw",
            height: "50vw",
            maxWidth: 720,
            maxHeight: 720,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(77,142,255,0.10) 0%, transparent 70%)",
            x: blueX,
            y: blueY,
            willChange: "transform",
          }}
          animate={{ scale: [1, 1.09, 1] }}
          transition={{ scale: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 } }}
        />
      </motion.div>
    </>
  );
}
