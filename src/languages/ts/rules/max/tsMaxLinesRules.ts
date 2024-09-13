import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import chalk from "chalk";

export class TSMaxLinesRule implements LabInsightRule {
  private maxLines: number;

  constructor(options: any) {
    this.maxLines = options.limit;
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

    if (totalLines > this.maxLines) {
      response = {
        severity: "error",
        message: `File exceeds the maximum allowed lines of ${chalk.bold(
          this.maxLines
        )}. Total lines: ${totalLines}`,
        path: filePath,
        line: totalLines,
        column: 0,
      };
    }

    return response;
  }
}
