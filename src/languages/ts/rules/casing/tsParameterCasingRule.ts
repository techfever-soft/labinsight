import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";

/**
 * Rule to enforce the casing convention for parameters in TypeScript
 */
export class TSParameterCasingRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(optionsMap: LabInsightRuleOptions) {
    this.options = optionsMap;
  }

  /**
   * Applies the rule to check the parameter casing convention
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

    const result = this.checkParameterCasing(sourceFile, filePath);

    return result;
  }

  /**
   * Checks the casing of parameters within functions or methods
   * @param sourceFile ts.SourceFile
   * @param filePath string
   */
  private checkParameterCasing(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isParameter(node)) {
        const parameterName = (node.name as ts.Identifier).text;

        if (!this.isValidCasing(parameterName)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );

          response = {
            severity: this.options.severity,
            message: `Parameter "${parameterName}" does not follow the ${this.options.options?.casing} naming convention.`,
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
   * Checks if the parameter follows the specified naming convention
   * @param paramName string
   * @returns boolean
   */
  private isValidCasing(paramName: string): boolean {
    switch (this.options.options?.casing) {
      case "camelCase":
        return /^[a-z][a-zA-Z0-9]*$/.test(paramName);
      case "snakeCase":
        return /^[a-z][a-z0-9_]*$/.test(paramName);
      case "pascalCase":
        return /^[A-Z][a-zA-Z0-9]*$/.test(paramName);
      case "upperCase":
        return /^[A-Z][A-Z0-9]*$/.test(paramName);
      default:
        return true;
    }
  }
}
