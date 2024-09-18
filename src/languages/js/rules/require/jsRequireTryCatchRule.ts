import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
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

    const checkNode = (node: any, ancestors: any[]) => {
      // Check if 'await' is used
      if (node.type === "AwaitExpression") {
        const line = node.loc?.start.line;

        // Check if the 'await' is inside a 'try' block
        const insideTryCatch = this.isInsideTryCatch(ancestors);

        // If 'await' is not inside a try-catch, trigger the rule
        if (!insideTryCatch) {
          responses.push({
            severity: this.options.severity,
            message: `The 'await' expression at line ${line} should be inside a try-catch block.`,
            line: line || 0,
            path: filePath,
          });
        }
      }
    };

    // Traverse the AST and check for AwaitExpression
    walk.ancestor(ast, {
      AwaitExpression: checkNode,
    });

    return responses;
  }

  /**
   * Helper function to check if 'await' is inside a 'try-catch' block
   * @param ancestors any[] - The list of ancestor nodes
   * @returns boolean
   */
  private isInsideTryCatch(ancestors: any[]): boolean {
    // Traverse ancestors to find if 'await' is inside a 'TryStatement'
    for (let i = ancestors.length - 1; i >= 0; i--) {
      if (ancestors[i].type === "TryStatement") {
        return true;
      }
    }
    return false;
  }
}
