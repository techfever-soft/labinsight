import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";

/**
 * Rule to enforce the maximum number of lines in a file or function for JavaScript files
 */
export class JSMaxLinesRule implements LabInsightRule {
  private maxLines: number;

  constructor(options: LabInsightRuleOptions) {
    this.maxLines = options.options?.limit || 200; // Default to 200 if no limit is provided
  }

  /**
   * Applies the rule to check the maximum lines in the file
   * @param fileContent string
   * @param filePath string
   */
  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse | null> {
    const totalLines = fileContent.split("\n").length;

    let response: LabInsightRuleResponse | null = null;

    if (totalLines > this.maxLines) {
      response = {
        severity: "error",
        path: filePath,
        message: `File exceeds the maximum allowed lines of ${this.maxLines}. Total lines: ${totalLines}`,
        line: totalLines,
        column: 0,
      };
    }

    return response;
  }
}
