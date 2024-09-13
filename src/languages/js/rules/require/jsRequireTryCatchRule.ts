import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

/**
 * Rule that checks if a try-catch is necessary for async code using 'await' in JavaScript
 */
export class JSRequireTryCatchRule implements LabInsightRule {
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
      locations: true, // pour obtenir les informations sur les lignes
    });

    const results = this.analyzeTryCatch(ast, filePath);

    return results;
  }

  /**
   * Analyzes the AST to check for 'await' usage inside blocks without try-catch
   * @param ast acorn.Node
   * @param filePath string
   * @returns LabInsightRuleResponse[]
   */
  private analyzeTryCatch(
    ast: acorn.Node,
    filePath: string
  ): LabInsightRuleResponse[] {
    const responses: LabInsightRuleResponse[] = [];

    const checkNode = (node: any) => {
      if (node && node.type) {
        // Check for async functions, if statements, and class methods
        if (
          node.type === "IfStatement" ||
          node.type === "FunctionDeclaration"
        ) {
          const line = node.loc?.start.line;

          // Check if 'await' is used in the condition or block
          const containsAwaitInCondition = node.test
            ? this.containsAwait(node.test)
            : false; // for 'if' statements
          const containsAwaitInBlock = node.consequent
            ? this.containsAwait(node.consequent)
            : this.containsAwait(node.body); // for method bodies or blocks

          // If 'await' is found without try-catch, trigger the rule
          if (containsAwaitInCondition || containsAwaitInBlock) {
            responses.push({
              severity: this.options.severity,
              message: `Consider using a try-catch block to handle the asynchronous operations`,
              line: line || 0,
              path: filePath,
            });
          }
        }

        // Check for class declarations and async methods
        if (node.type === "ClassDeclaration" || node.type === "ClassExpression") {
          node.body.body.forEach((classElement: any) => {
            // Check if it's a method and if it's async
            if (
              classElement.type === "MethodDefinition" &&
              classElement.value.async
            ) {
              const methodBody = classElement.value.body;
              const line = classElement.loc?.start.line;

              // Check if 'await' is inside the method body
              const containsAwaitInMethod = this.containsAwait(methodBody);

              // If 'await' is found without try-catch in the method, trigger the rule
              if (containsAwaitInMethod) {
                responses.push({
                  severity: this.options.severity,
                  message: `Consider using a try-catch block in async method '${classElement.key.name}'`,
                  line: line || 0,
                  path: filePath,
                });
              }
            }
          });
        }
      }
    };

    // Traverse the AST
    walk.simple(ast, {
      IfStatement: checkNode,
      FunctionDeclaration: checkNode, // Check function declarations
      MethodDefinition: checkNode, // Check class methods
      ClassDeclaration: checkNode, // Check classes
      ClassExpression: checkNode, // Check class expressions
    });

    return responses; 
  }

  /**
   * Helper function to check if a node contains an 'await' expression
   * @param node acorn.Node
   * @returns boolean
   */
  private containsAwait(node: acorn.Node): boolean {
    let containsAwait = false;

    if (!node) return containsAwait; // Return false if the node is undefined

    // Walk through the node to find 'await' expressions
    walk.simple(node, {
      AwaitExpression() {
        containsAwait = true;
      },
    });

    return containsAwait;
  }
}
