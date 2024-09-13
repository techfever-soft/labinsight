import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";

/**
 * Rule to enforce the casing convention for methods in TypeScript
 */
export class TSMethodCasingRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
  }

  /**
   * Applies the rule to check the method casing convention
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

    const result = this.checkMethodCasing(sourceFile, filePath);

    return result;
  }

  /**
   * Checks the casing of methods within classes or objects
   * @param sourceFile ts.SourceFile
   * @param filePath string
   */
  private checkMethodCasing(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isMethodDeclaration(node) || ts.isFunctionDeclaration(node)) {
        const methodName = (node.name as ts.Identifier).text;

        if (!this.isValidCasing(methodName)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );

          response = {
            severity: this.options.severity,
            message: `Method "${methodName}" does not follow the ${this.options.options?.casing} naming convention.`,
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
   * Checks if the method follows the specified naming convention
   * @param methodName string
   * @returns boolean
   */
  private isValidCasing(methodName: string): boolean {
    switch (this.options.options?.casing) {
      case "camelCase":
        return /^[a-z][a-zA-Z0-9]*$/.test(methodName);
      case "snakeCase":
        return /^[a-z][a-z0-9_]*$/.test(methodName);
      case "pascalCase":
        return /^[A-Z][a-zA-Z0-9]*$/.test(methodName);
      case "upperCase":
        return /^[A-Z][A-Z0-9]*$/.test(methodName);
      default:
        return true;
    }
  }
}
