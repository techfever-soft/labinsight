import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";

export class TSMaxArrayLengthRule implements LabInsightRule {
  private limit: number;

  constructor(options: LabInsightRuleOptions) {
    this.limit = options.options?.limit;
  }

  /**
   * Applies the rule
   * @param fileContent string
   * @param filePath string
   */
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

    const result = this.checkArrayLength(sourceFile, filePath);

    return result;
  }

  /**
   * Checks if the array length exceeds the maximum allowed length
   * @param sourceFile ts.SourceFile
   * @param filePath string
   * @returns LabInsightRuleResponse | null
   */
  private checkArrayLength(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let ruleViolated = false;
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isArrayLiteralExpression(node)) {
        const arrayLength = node.elements.length;

        if (arrayLength > this.limit) {
          ruleViolated = true;
          const firstElementPosition = node.getStart(sourceFile);

          const { line, character } =
            sourceFile.getLineAndCharacterOfPosition(firstElementPosition);

          response = {
            severity: "error",
            message: `Array exceeds the maximum allowed length of ${this.limit}. Array length: ${arrayLength}`,
            path: filePath,
            line: line + 1,
            column: character + 1,
          };
        }
      }

      ts.forEachChild(node, visitNode);
    };

    visitNode(sourceFile);

    return response;
  }
}
