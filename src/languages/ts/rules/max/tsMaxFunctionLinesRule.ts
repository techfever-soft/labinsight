import {
  LabInsightRule,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import ts from "typescript";

export class TSMaxFunctionLinesRule implements LabInsightRule {
  private limit: number;

  constructor(options: any) {
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

    const result = this.analyzeFunctionLines(sourceFile, filePath);

    return result;
  }

  private analyzeFunctionLines(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visit = (node: ts.Node) => {
      const isFunction =
        ts.isFunctionDeclaration(node) ||
        ts.isArrowFunction(node) ||
        ts.isFunctionExpression(node);

      if (isFunction) {
        const { line: startLine } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart()
        );
        const { line: endLine } = sourceFile.getLineAndCharacterOfPosition(
          node.getEnd()
        );

        const functionLines = endLine - startLine + 1;

        if (functionLines > this.limit) {
          response = {
            severity: "error",
            path: filePath,
            message: `The function has ${functionLines} lines, which exceeds the limit of ${this.limit} lines.`,
            line: startLine + 1,
            column: 0,
          };
        }
      }

      ts.forEachChild(node, visit);
    };

    ts.forEachChild(sourceFile, visit);

    return response;
  }
}
