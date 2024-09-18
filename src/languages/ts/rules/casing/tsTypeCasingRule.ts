import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";

/**
 * Rule to enforce the casing convention for types in TypeScript
 */
export class TSTypeCasingRule implements LabInsightRule {
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

    const result = this.checkTypeCasing(sourceFile, filePath);

    return result;
  }

  private checkTypeCasing(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isTypeAliasDeclaration(node)) {
        const typeName = node.name.text;

        if (!this.isValidCasing(typeName)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );

          response = {
            severity: this.options.severity,
            message: `Type "${typeName}" does not follow the ${this.options.options?.casing} naming convention.`,
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

  private isValidCasing(typeName: string): boolean {
    switch (this.options.options?.casing) {
      case "camelCase":
        return /^[a-z][a-zA-Z0-9]*$/.test(typeName);
      case "snakeCase":
        return /^[a-z][a-z0-9_]*$/.test(typeName);
      case "pascalCase":
        return /^[A-Z][a-zA-Z0-9]*$/.test(typeName);
      case "upperCase":
        return /^[A-Z][A-Z0-9]*$/.test(typeName);
      default:
        return true;
    }
  }
}
