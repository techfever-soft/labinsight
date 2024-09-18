import {
  LabInsightProjectType,
  LabInsightProjectEngine,
  LabInsightProjectEnvironment,
  LabInsightProjectLinting,
} from "../types/config.type";
import { LabInsightCustomRule, LabInsightRuleConfig } from "./rule.interface";

/**
 * Configuration file schema (JSON)
 */
export interface LabInsightConfig {
  $schema: string; // Configuration schema
  version: number; // Configuration file version
  projectName: string; // Project name
  projectType: LabInsightProjectType; // Project type
  engine: LabInsightProjectEngine; // Rendering engine
  environment: LabInsightProjectEnvironment; // Working environment

  ignoredDirectories: string[]; // Directories to ignore
  ignoredFiles: string[]; // Files to ignore

  rules: LabInsightRuleConfig;
  customRules?: LabInsightCustomRule[]; // To register custom rules

  linting: LabInsightProjectLinting; // Linting tool
}
