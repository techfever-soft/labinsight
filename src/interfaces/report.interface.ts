import { AnalysisResult, CodeComplexityResult } from "./analyzer.interface";
import { LabInsightRuleResponse } from "./rule.interface";

/**
 * Deep report interface
 */
export interface DeepReport {
  files: AnalysisResult[];
  complexity: CodeComplexityResult;
}

/**
 * Basic report interface
 */
export interface BasicReport {
  files: LabInsightRuleResponse[];
}

/**
 * Dependency report interface
 */
export interface DependencyReport {
  dependencies: any;
  devDependencies: any;
}
