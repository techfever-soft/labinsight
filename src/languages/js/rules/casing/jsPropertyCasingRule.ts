import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

export class JSPropertyCasingRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse[]> {
    const ast = acorn.parse(fileContent, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true, 
    });

    const results = this.checkPropertyCasing(ast, filePath);

    return results;
  }

  /**
   * Traverse the AST to check for property casing violations
   * @param ast acorn.Node
   * @param filePath string
   * @returns LabInsightRuleResponse[]
   */
  private checkPropertyCasing(
    ast: acorn.Node,
    filePath: string
  ): LabInsightRuleResponse[] {
    let responses: LabInsightRuleResponse[] = [];

    const checkNode = (node: any) => {
      if (node.type === "Property") {
        const propertyName = node.key?.name;

        // Check only for named properties (ignore dynamic properties)
        if (propertyName && !this.isValidCasing(propertyName)) {
          const line = node.loc?.start.line;

          responses.push({
            severity: this.options.options?.severity || "warning",
            message: `Property "${propertyName}" does not follow the ${this.options.options?.casing} naming convention.`,
            path: filePath,
            line: line || 0,
          });
        }
      }

      // Check for MemberExpression (e.g., obj.property)
      if (node.type === "MemberExpression" && node.property && !node.computed) {
        const propertyName = node.property?.name;

        if (propertyName && !this.isValidCasing(propertyName)) {
          const line = node.loc?.start.line;

          responses.push({
            severity: this.options.options?.severity || "warning",
            message: `Property "${propertyName}" in expression does not follow the ${this.options.options?.casing} naming convention.`,
            path: filePath,
            line: line || 0,
          });
        }
      }

      // Check for class properties
      if (node.type === "MethodDefinition" || node.type === "ClassProperty") {
        const propertyName = node.key?.name;

        if (propertyName && !this.isValidCasing(propertyName)) {
          const line = node.loc?.start.line;

          responses.push({
            severity: this.options.options?.severity || "warning",
            message: `Class property "${propertyName}" does not follow the ${this.options.options?.casing} naming convention.`,
            path: filePath,
            line: line || 0,
          });
        }
      }
    };

    walk.simple(ast, {
      Property: checkNode,
      MemberExpression: checkNode,
      MethodDefinition: checkNode,
    });

    return responses;
  }

  /**
   * Validates the casing of a property name
   * @param name string
   * @returns boolean
   */
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
