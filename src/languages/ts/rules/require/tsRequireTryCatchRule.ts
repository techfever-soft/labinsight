import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import ts from "typescript";

/**
 * Rule that checks if a try-catch is necessary for async code using 'await'
 */
export class TSRequireTryCatchRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(private optionsMap: LabInsightRuleOptions) {
    this.options = optionsMap;
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

    const result = this.analyzeTryCatch(sourceFile, filePath);

    return result;
  }

  /**
   * Analyzes the source file to check for 'await' usage inside 'if' blocks without try-catch
   * @param sourceFile ts.SourceFile
   * @param filePath string
   * @returns LabInsightRuleResponse | null
   */
  private analyzeTryCatch(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      // Check if it's an 'if' statement
      if (ts.isIfStatement(node)) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart()
        );

        // Check if the 'if' block contains 'await'
        const ifConditionContainsAwait = this.containsAwait(node.expression);
        const thenBlockContainsAwait = this.containsAwait(node.thenStatement);

        // If 'await' is used in the 'if' condition or block without try-catch, trigger the rule
        if (ifConditionContainsAwait || thenBlockContainsAwait) {
          response = {
            severity: this.options.severity,
            message: `Consider using a try-catch block to handle the asynchronous operations in the 'if' statement`,
            line: line + 1,
            path: filePath,
          };
        }
      }

      ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(sourceFile, visitNode);

    return response;
  }

  /**
   * Helper function to check if a node contains an 'await' expression
   * @param node ts.Node
   * @returns boolean
   */
  private containsAwait(node: ts.Node): boolean {
    let containsAwait = false;

    const visitChild = (childNode: ts.Node): void => {
      if (ts.isAwaitExpression(childNode)) {
        containsAwait = true;
      }
      ts.forEachChild(childNode, visitChild);
    };

    if (node) {
      visitChild(node);
    }

    return containsAwait;
  }
}
