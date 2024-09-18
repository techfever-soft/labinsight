import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";

/**
 * Rule to enforce the casing convention for interfaces in TypeScript
 */
export class TSInterfaceCasingRule implements LabInsightRule {
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

    const result = this.checkInterfaceCasing(sourceFile, filePath);

    return result;
  }

  private checkInterfaceCasing(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isInterfaceDeclaration(node)) {
        const interfaceName = node.name.text;

        if (!this.isValidCasing(interfaceName)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );

          response = {
            severity: this.options.severity,
            message: `Interface "${interfaceName}" does not follow the ${this.options.options?.casing} naming convention.`,
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

  private isValidCasing(interfaceName: string): boolean {
    switch (this.options.options?.casing) {
      case "camelCase":
        return /^[a-z][a-zA-Z0-9]*$/.test(interfaceName);
      case "snakeCase":
        return /^[a-z][a-z0-9_]*$/.test(interfaceName);
      case "pascalCase":
        return /^[A-Z][a-zA-Z0-9]*$/.test(interfaceName);
      case "upperCase":
        return /^[A-Z][A-Z0-9]*$/.test(interfaceName);
      default:
        return true;
    }
  }
}
