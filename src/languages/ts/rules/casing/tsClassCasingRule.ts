import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";

/**
 * Rule to enforce the casing convention for classes in TypeScript
 */
export class TSClassCasingRule implements LabInsightRule {
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

    const result = this.checkClassCasing(sourceFile, filePath);

    return result;
  }

  private checkClassCasing(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isClassDeclaration(node)) {
        const className = node.name?.text;

        if (className && !this.isValidCasing(className)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );

          response = {
            severity: this.options.severity,
            message: `Class "${className}" does not follow the ${this.options.options?.casing} naming convention.`,
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

  private isValidCasing(className: string): boolean {
    switch (this.options.options?.casing) {
      case "camelCase":
        return /^[a-z][a-zA-Z0-9]*$/.test(className);
      case "snakeCase":
        return /^[a-z][a-z0-9_]*$/.test(className);
      case "pascalCase":
        return /^[A-Z][a-zA-Z0-9]*$/.test(className);
      case "upperCase":
        return /^[A-Z][A-Z0-9]*$/.test(className);
      default:
        return true;
    }
  }
}
