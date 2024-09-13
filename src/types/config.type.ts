/**
 * Project detection types
 */
export type LabInsightProjectType =
  | "none"
  | "node"
  | "react"
  | "vue"
  | "angular"
  | "svelte"
  | "lit-element"
  | "stencil"
  | "static"
  | "other";

/**
 * Project engine types
 */
export type LabInsightProjectEngine =
  | "none"
  | "webpack"
  | "vite"
  | "esbuild"
  | "rollup"
  | "parcel";

/**
 * Linting tool used in the project
 */
export type LabInsightProjectLinting = "eslint" | "prettier" | "both" | "none";

/**
 * Environment in which the project is running
 */
export type LabInsightProjectEnvironment = "development" | "production";
