import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";

/**
 * Rule to enforce the casing convention for properties in TypeScript
 */
export class TSPropertyCasingRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
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

    const result = this.checkPropertyCasing(sourceFile, filePath);

    return result;
  }

  private checkPropertyCasing(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isPropertyDeclaration(node)) {
        const propertyName = (node.name as ts.Identifier).text;

        if (!this.isValidCasing(propertyName)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );

          response = {
            severity: this.options.severity,
            message: `Property "${propertyName}" does not follow the ${this.options.options?.casing} naming convention.`,
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

  private isValidCasing(propertyName: string): boolean {
    switch (this.options.options?.casing) {
      case "camelCase":
        return /^[a-z][a-zA-Z0-9]*$/.test(propertyName);
      case "snakeCase":
        return /^[a-z][a-z0-9_]*$/.test(propertyName);
      case "pascalCase":
        return /^[A-Z][a-zA-Z0-9]*$/.test(propertyName);
      case "upperCase":
        return /^[A-Z][A-Z0-9]*$/.test(propertyName);
      default:
        return true;
    }
  }
}
