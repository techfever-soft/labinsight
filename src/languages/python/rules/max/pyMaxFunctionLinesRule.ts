import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import { PyDirectoryAnalyzer } from "@languages/python/analyzers/pyDirectoryAnalyzer";

export class PyMaxFunctionLines implements LabInsightRule {
  private limit: number;

  constructor(private options: LabInsightRuleOptions) {
    this.limit = options.options?.limit || 50; // Default limit if not provided
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse | LabInsightRuleResponse[] | null> {
    const pyDirectoryAnalyzer = new PyDirectoryAnalyzer();
    const ast = await pyDirectoryAnalyzer.analyzePythonFile(filePath); // Get the Python AST

    return this.checkFunctionLines(ast, filePath);
  }

  /**
   * Checks if functions in the AST exceed the specified line limit
   * @param ast The AST of the Python file
   * @param filePath The path of the analyzed file
   * @returns LabInsightRuleResponse[] Array of rule violations
   */
  private checkFunctionLines(
    ast: any,
    filePath: string
  ): LabInsightRuleResponse[] {
    const responses: LabInsightRuleResponse[] = [];

    // Helper function to check each function in the AST
    const checkNode = (node: any) => {
      // Check for function definitions (FunctionDef)
      if (node._type === "FunctionDef") {
        const functionName = node.name || "anonymous function";

        // Count the number of expressions/statements in the function body
        const totalStatements = node.body.length;

        // If the function exceeds the max statements, add it to the response
        if (totalStatements > this.limit) {
          responses.push({
            severity: this.options.severity || "error",
            message: `Function '${functionName}' exceeds the maximum number of lines (${this.limit}). Total lines: ${totalStatements}`,
            path: filePath,
            line: 0, // Line number information is not available
          });
        }
      }

      // Recursively check any child nodes in 'body' if available
      if (node.body) {
        node.body.forEach((childNode: any) => checkNode(childNode));
      }
    };

    // Start by checking the body of the module
    if (ast._type === "Module" && ast.body) {
      ast.body.forEach((node: any) => checkNode(node));
    }

    return responses;
  }
}
