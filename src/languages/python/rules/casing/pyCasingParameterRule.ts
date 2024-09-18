import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import { PyDirectoryAnalyzer } from "../../../../languages/python/analyzers/pyDirectoryAnalyzer";

export class PyCasingParameterRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse | LabInsightRuleResponse[] | null> {
    const pyDirectoryAnalyzer = new PyDirectoryAnalyzer();
    const ast = await pyDirectoryAnalyzer.analyzePythonFile(filePath);

    return this.checkParameterCasing(ast, filePath);
  }

  /**
   * Check if the parameters of functions and methods follow the correct casing convention
   * @param ast The AST of the Python file
   * @param filePath The path of the analyzed file
   * @returns LabInsightRuleResponse[]
   */
  private checkParameterCasing(
    ast: any,
    filePath: string
  ): LabInsightRuleResponse[] {
    let responses: LabInsightRuleResponse[] = [];

    const checkNode = (node: any) => {
      if (node._type === "FunctionDef" || node._type === "AsyncFunctionDef") {
        // Loop through the parameters of the function or method
        node.args.args.forEach((param: any) => {
          const paramName = param.arg;

          if (paramName && !this.isValidCasing(paramName)) {
            responses.push({
              severity: "error",
              message: `Parameter "${paramName}" in function "${node.name}" does not follow the ${this.options.options?.casing} naming convention.`,
              path: filePath,
              line: node.lineno || 0,
            });
          }
        });
      }

      // Traverse the body recursively
      if (node.body) {
        node.body.forEach((childNode: any) => checkNode(childNode));
      }
    };

    // Start traversing the AST from the body of the module
    if (ast.body) {
      ast.body.forEach((node: any) => checkNode(node));
    }

    return responses;
  }

  /**
   * Validate the casing of a parameter name based on the selected convention
   * @param name The name of the parameter
   * @returns boolean
   */
  private isValidCasing(name: string): boolean {
    switch (this.options.options?.casing) {
      case "camelCase":
        return /^[a-z][a-zA-Z0-9]*$/.test(name);
      case "snake_case":
        return /^[a-z][a-z0-9_]*$/.test(name);
      case "PascalCase":
        return /^[A-Z][a-zA-Z0-9]*$/.test(name);
      case "UPPER_CASE":
        return /^[A-Z][A-Z0-9_]*$/.test(name);
      default:
        return true;
    }
  }
}
