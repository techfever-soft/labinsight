import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";

/**
 * Rule to enforce the maximum recursion depth in functions/methods
 */
export class TSLimitRecursionDepthRule implements LabInsightRule {
  private options: LabInsightRuleOptions;
  private recursionDepth: number = 0;

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
  }

  /**
   * Applies the rule to check for recursion depth
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

    const result = await this.checkRecursionDepth(sourceFile, filePath);
    return result;
  }

  /**
   * Analyzes the recursion depth of functions in the source file
   * @param sourceFile ts.SourceFile
   * @param filePath string
   */
  private async checkRecursionDepth(
    sourceFile: ts.SourceFile,
    filePath: string
  ): Promise<LabInsightRuleResponse | null> {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
        this.recursionDepth = 0; // Reset recursion depth for each function

        const functionName = (node.name as ts.Identifier).text;
        const { line } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart()
        );

        // Analyze the function's body for recursive calls
        this.analyzeRecursiveCalls(node.body!, functionName);

        // Check if the recursion depth exceeds the allowed limit
        if (this.recursionDepth > (this.options.options?.limit || 5)) {
          response = {
            severity: this.options.severity,
            message: `Recursion depth exceeds the limit of ${
              this.options.options?.limit || 5
            } in function "${functionName}"`,
            path: filePath,
            line: line + 1,
          };
        }
      }

      ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(sourceFile, visitNode);

    return response;
  }

  /**
   * Analyzes the body of a function to check for recursive calls
   * @param body ts.Block
   * @param functionName string
   */
  private analyzeRecursiveCalls(body: ts.Block, functionName: string): void {
    const checkRecursiveCall = (node: ts.Node): void => {
      if (ts.isCallExpression(node)) {
        const calledFunctionName = node.expression.getText();
        if (calledFunctionName === functionName) {
          this.recursionDepth++; // Increase recursion depth for each recursive call
        }
      }

      ts.forEachChild(node, checkRecursiveCall);
    };

    ts.forEachChild(body, checkRecursiveCall);
  }
}
