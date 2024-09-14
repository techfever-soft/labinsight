import { LabInsightSeverity } from "@lab-types/convention.type";

/**
 * Interface for the rule
 */
export interface LabInsightRule {
  apply: (
    fileContent: string,
    filePath: string
  ) => Promise<LabInsightRuleResponse[] | LabInsightRuleResponse | null>;
}

/**
 * Interface for the rule response
 */
export interface LabInsightRuleResponse {
  message: string;
  severity: LabInsightSeverity;
  path: string;
  line?: number;
  column?: number;
}

/**
 * Interface for custom rules
 */
export interface LabInsightCustomRule extends LabInsightRule {
  path: string;
  name: string;
  description: string;
  options?: any;
  severity: LabInsightSeverity;
  apply(
    fileContent: string,
    filePath?: string
  ): Promise<LabInsightRuleResponse | null>;
}

/**
 * Interface for the configuration map of the rules
 */
export interface LabInsightRuleConfig {
  [ruleName: string]: LabInsightRuleOptions;
}

/**
 * Interface for the options of the rules
 */
export interface LabInsightRuleOptions {
  severity: LabInsightSeverity;
  options?: {
    [optionName: string]: any;
  };
}
