import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import chalk from "chalk";

export class PyMaxLines implements LabInsightRule {
  private limit: number;

  constructor(private options: LabInsightRuleOptions) {
    this.limit = options.options?.limit;
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse | LabInsightRuleResponse[] | null> {
    const lines = fileContent.split("\n");

    if (lines.length > this.limit) {
      const result: LabInsightRuleResponse = {
        severity: "error",
        message: `File exceeds the maximum allowed lines of ${chalk.bold(
          this.limit
        )}. Total lines: ${lines.length}`,
        path: filePath,
        line: 0,
        column: 0,
      };

      return result;
    }

    return null;
  }
}
