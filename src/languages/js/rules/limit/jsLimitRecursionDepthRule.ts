import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

export class JSLimitRecursionDepthRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse[]> {
    const ast = acorn.parse(fileContent, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true, // Keep track of code locations
    });

    const results = this.checkRecursionDepth(ast, filePath);

    return results;
  }

  /**
   * Traverse the AST to check for recursion depth violations
   * @param ast acorn.Node
   * @param filePath string
   * @returns LabInsightRuleResponse[]
   */
  private checkRecursionDepth(
    ast: acorn.Node,
    filePath: string
  ): LabInsightRuleResponse[] {
    const responses: LabInsightRuleResponse[] = [];

    // Object to track recursion depth of each function
    const functionStack: { [key: string]: number } = {};

    const checkNode = (node: any) => {
      if (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression"
      ) {
        const functionName = node.id?.name || "anonymous";
        const maxDepth = this.options?.options?.maxDepth || 3;
        const severity = this.options?.options?.severity;

        walk.ancestor(node, {
          CallExpression(callNode: any, ancestors: any) {
            const calleeName = callNode.callee.name;

            // Check if function calls itself (recursion)
            if (calleeName === functionName) {
              const depth = (functionStack[calleeName] || 0) + 1;

              // Store recursion depth
              functionStack[calleeName] = depth;

              if (depth > maxDepth) {
                responses.push({
                  severity: severity || "warning",
                  message: `Function "${functionName}" exceeds the maximum recursion depth of ${maxDepth}.`,
                  path: filePath,
                  line: callNode.loc?.start.line || 0,
                });
              }
            }
          },
        });
      }
    };

    walk.simple(ast, {
      FunctionDeclaration: checkNode,
      FunctionExpression: checkNode,
    });

    return responses;
  }
}
