"use client";

import React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export interface ScrollRevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  delay?: number; // In milliseconds (e.g. 100)
  duration?: number; // In milliseconds (e.g. 450)
  distance?: number; // In px (e.g. 18)
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
  className?: string;
  animateOnMount?: boolean;
}

/**
 * Lightweight, GPU-accelerated Scroll Reveal powered by Framer Motion.
 * Optimized for 60-120 FPS buttery smoothness with minimal overhead:
 * - Hardware composited transitions (opacity + translate3d).
 * - Snappy Apple-style cubic-bezier easing.
 * - Single-fire viewport listener (once: true) to prevent scroll listeners CPU usage.
 * - Native prefers-reduced-motion support.
 * - Optional animateOnMount for instant hero rendering on reload.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 450,
  distance = 18,
  direction = "up",
  once = true,
  className = "",
  animateOnMount = false,
  style,
  ...props
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, render immediately without transitions
  if (shouldReduceMotion) {
    return (
      <div className={className} style={style as React.CSSProperties} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  const getInitialOffset = () => {
    switch (direction) {
      case "up":
        return { x: 0, y: distance };
      case "down":
        return { x: 0, y: -distance };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getInitialOffset();
  const delaySec = Math.max(0, delay / 1000);
  const durationSec = Math.max(0.15, duration / 1000);

  // High-performance cubic-bezier easing (crisp, elegant, zero sluggishness)
  const transition = {
    duration: durationSec,
    delay: delaySec,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  // Immediate entrance on mount (vital for heroes so page reloads feel instant)
  if (animateOnMount) {
    return (
      <motion.div
        initial={{ opacity: 0, ...initialOffset }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={transition}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.12, margin: "0px 0px -30px 0px" }}
      transition={transition}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
