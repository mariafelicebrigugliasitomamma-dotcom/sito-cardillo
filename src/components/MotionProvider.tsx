"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Con "riduci movimento" attivo nel sistema, framer-motion salta traslazioni e
// parallasse (le dissolvenze restano): il CSS globale non basta per queste animazioni.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
