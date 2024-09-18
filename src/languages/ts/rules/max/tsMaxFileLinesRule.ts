import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import chalk from "chalk";

export class TSMaxFileLinesRule implements LabInsightRule {
  private limit: number;

  constructor(options: LabInsightRuleOptions) {
    this.limit = options.options?.limit;
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse | null> {
    const sourceFile = ts.createSourceFile(
      filePath,
      fileContent,
      ts.ScriptTarget.Latest,
      true
    );

    const result = this.analyzeFileLines(sourceFile, filePath);

    return result;
  }

  private analyzeFileLines(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    const totalLines =
      sourceFile.getLineAndCharacterOfPosition(sourceFile.getEnd()).line + 1;

    let response: LabInsightRuleResponse | null = null;

    if (totalLines > this.limit) {
      response = {
        severity: "error",
        message: `File exceeds the maximum allowed lines of ${chalk.bold(
          this.limit
        )}. Total lines: ${totalLines}`,
        path: filePath,
        line: totalLines,
        column: 0,
      };
    }

    return response;
  }
}
