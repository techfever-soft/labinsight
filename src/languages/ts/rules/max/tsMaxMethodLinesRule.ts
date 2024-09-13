import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import chalk from "chalk";

export class TSMaxMethodLinesRule implements LabInsightRule {
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

    const result = this.analyzeMethods(sourceFile, filePath);

    return result;
  }

  private analyzeMethods(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let ruleViolated = false;
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isMethodDeclaration(node) || ts.isFunctionDeclaration(node)) {
        const startLine =
          sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
        const endLine =
          sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line + 1;
        const lines = endLine - startLine;

        if (lines > this.maxLines) {
          // Change the max lines here
          ruleViolated = true;
          response = {
            severity: "error",
            message: `Method exceeds the maximum allowed lines of ${chalk.bold(
              this.maxLines
            )}. Total lines: ${lines}`,
            path: filePath,
            line: startLine,
            column: 0,
          };
        }
      }

      ts.forEachChild(node, visitNode);
    };

    visitNode(sourceFile);

    return response;
  }
}
