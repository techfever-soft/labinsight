import { LabInsightRule, LabInsightRuleResponse } from "../../../../interfaces/rule.interface";
import * as acorn from "acorn";

/**
 * Rule that checks if every function has a JSDoc description.
 */
export class JSRequireFunctionDescriptionRule implements LabInsightRule {
  private options: any;

  constructor(options: any) {
    this.options = options;
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse[]> {
    const ast = acorn.parse(fileContent, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true, // To get line and column numbers
    });

    return this.checkFunctionDescriptions(ast, filePath);
  }

  /**
   * Traverse the AST and check that all functions have a JSDoc description.
   * @param ast The parsed Abstract Syntax Tree (AST)
   * @param filePath The path of the file being analyzed
   * @returns LabInsightRuleResponse[] An array of responses indicating if functions are missing descriptions
   */
  private checkFunctionDescriptions(
    ast: acorn.Node,
    filePath: string
  ): LabInsightRuleResponse[] {
    const responses: LabInsightRuleResponse[] = [];

    const comments: any[] = (ast as any).comments || [];

    const checkNode = (node: any) => {
      if (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression"
      ) {
        const functionName =
          node.id?.name || node.key?.name || "anonymous function";

        const hasJSDoc = this.hasJSDocComment(node, comments);

        if (!hasJSDoc) {
          responses.push({
            severity: this.options?.severity || "error",
            message: `The function '${functionName}' is missing a JSDoc description.`,
            path: filePath,
            line: node.loc.start.line,
          });
        }
      }

      if (node.body && node.body.type === "BlockStatement") {
        node.body.body.forEach((childNode: any) => checkNode(childNode));
      }
    };

    (ast as any).body.forEach((node: any) => checkNode(node));

    return responses;
  }

  /**
   * Helper function to check if a node has a JSDoc comment immediately before it.
   * @param node The AST node being checked
   * @param comments An array of comments in the file
   * @returns boolean Whether the node has a JSDoc comment
   */
  private hasJSDocComment(node: any, comments: any[]): boolean {
    const nodeStartLine = node.loc.start.line;

    return comments.some((comment: any) => {
      return (
        comment.type === "Block" &&
        comment.value.trim().startsWith("*") &&
        comment.loc.end.line === nodeStartLine - 1
      );
    });
  }
}
