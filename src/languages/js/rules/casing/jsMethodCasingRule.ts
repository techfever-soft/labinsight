import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

export class JSMethodCasingRule implements LabInsightRule {
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

    const result = this.checkMethodCasing(ast, filePath);

    return result;
  }

  private checkMethodCasing(
    ast: acorn.Node,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const checkNode = (node: any) => {
      if (node.type === "MethodDefinition") {
        const methodName = node.key?.name;

        if (methodName && !this.isValidCasing(methodName)) {
          const line = node.loc?.start.line; // Obtenez la ligne

          response = {
            severity: this.options.options?.severity,
            message: `Method "${methodName}" does not follow the ${this.options.options?.casing} naming convention.`,
            path: filePath,
            line: line || 0,
          };
        }
      }
    };

    walk.simple(ast, {
      MethodDefinition: checkNode, 
    });

    return response;
  }

  private isValidCasing(name: string): boolean {
    switch (this.options.options?.casing) {
      case "camelCase":
        return /^[a-z][a-zA-Z0-9]*$/.test(name);
      case "snakeCase":
        return /^[a-z][a-z0-9_]*$/.test(name);
      case "pascalCase":
        return /^[A-Z][a-zA-Z0-9]*$/.test(name);
      case "upperCase":
        return /^[A-Z][A-Z0-9]*$/.test(name);
      default:
        return true;
    }
  }
}
