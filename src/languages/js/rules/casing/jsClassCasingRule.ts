import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

export class JSClassCasingRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse | null> {
    const ast = acorn.parse(fileContent, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true,
    });

    const result = this.checkClassCasing(ast, filePath);

    return result;
  }

  private checkClassCasing(
    ast: acorn.Node,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const checkNode = (node: any) => {
      if (node.type === "ClassDeclaration" && node.id && node.id.name) {
        const className = node.id.name; 

        if (className && !this.isValidCasing(className)) {
          const line = node.loc?.start.line;

          response = {
            severity: this.options.options?.severity,
            message: `Class "${className}" does not follow the ${this.options.options?.casing} naming convention.`,
            path: filePath,
            line: line || 0,
          };
        }
      }
    };

    walk.simple(ast, {
      ClassDeclaration: checkNode,
    });

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
