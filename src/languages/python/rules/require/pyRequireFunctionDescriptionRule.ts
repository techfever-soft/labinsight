import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import { PyDirectoryAnalyzer } from "../../../../languages/python/analyzers/pyDirectoryAnalyzer";

export class PyRequireFunctionDescriptionRule implements LabInsightRule {
  constructor(private options: LabInsightRuleOptions) {}

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse | LabInsightRuleResponse[] | null> {
    const pyDirectoryAnalyzer = new PyDirectoryAnalyzer();
    const ast = await pyDirectoryAnalyzer.analyzePythonFile(filePath);

    return this.checkFunctionDescriptions(ast, filePath);
  }

  /**
   * Check if functions in the AST have a description (docstring)
   * @param ast The AST of the Python file
   * @param filePath The path of the analyzed file
   * @returns LabInsightRuleResponse[]
   */
  private checkFunctionDescriptions(
    ast: any,
    filePath: string
  ): LabInsightRuleResponse[] {
    const responses: LabInsightRuleResponse[] = [];

    // Helper function to check each function
    const checkFunctionNode = (node: any) => {
      if (node._type === "FunctionDef") {
        const functionName = node.name || "anonymous function";

        // Check if the first node in the body is a docstring (Expr node with Constant or Str)
        const firstBodyNode = node.body[0];
        const hasDocstring =
          firstBodyNode &&
          firstBodyNode._type === "Expr" &&
          firstBodyNode.value._type === "Constant" &&
          typeof firstBodyNode.value.value === "string";

        if (!hasDocstring) {
          responses.push({
            severity: this.options.severity || "error",
            message: `Function '${functionName}' is missing a docstring.`,
            path: filePath,
            line: node.lineno || 0, // Use 'lineno' if available
          });
        }
      }
    };

    // Traverse the AST to check each function
    if (ast._type === "Module" && ast.body) {
      ast.body.forEach((node: any) => checkFunctionNode(node));
    }

    return responses;
  }
}
