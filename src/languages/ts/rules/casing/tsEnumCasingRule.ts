import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";

/**
 * Rule to enforce the casing convention for enums in TypeScript
 */
export class TSEnumCasingRule implements LabInsightRule {
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

    const result = this.checkEnumCasing(sourceFile, filePath);

    return result;
  }

  private checkEnumCasing(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isEnumDeclaration(node)) {
        const enumName = node.name.text;

        if (!this.isValidCasing(enumName)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );

          response = {
            severity: this.options.severity,
            message: `Enum "${enumName}" does not follow the ${this.options.options?.casing} naming convention.`,
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

  private isValidCasing(enumName: string): boolean {
    switch (this.options.options?.casing) {
      case "camelCase":
        return /^[a-z][a-zA-Z0-9]*$/.test(enumName);
      case "snakeCase":
        return /^[a-z][a-z0-9_]*$/.test(enumName);
      case "pascalCase":
        return /^[A-Z][a-zA-Z0-9]*$/.test(enumName);
      case "upperCase":
        return /^[A-Z][A-Z0-9]*$/.test(enumName);
      default:
        return true;
    }
  }
}
