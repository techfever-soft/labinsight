import {
    LabInsightRule,
    LabInsightRuleOptions,
    LabInsightRuleResponse,
  } from "@interfaces/rule.interface";
  import * as acorn from "acorn";
  import * as walk from "acorn-walk";
  
  export class JSFunctionCasingRule implements LabInsightRule {
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
  
      const result = this.checkFunctionCasing(ast, filePath);
  
      return result;
    }
  
    private checkFunctionCasing(
      ast: acorn.Node,
      filePath: string
    ): LabInsightRuleResponse | null {
      let response: LabInsightRuleResponse | null = null;
  
      const checkNode = (node: any) => {
        if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
          const functionName = node.id?.name || node.key?.name;
  
          if (functionName && !this.isValidCasing(functionName)) {
            const line = node.loc?.start.line; 
  
            response = {
              severity: this.options.options?.severity,
              message: `Function "${functionName}" does not follow the ${this.options.options?.casing} naming convention.`,
              path: filePath,
              line: line || 0,
            };
          }
        }
      };
  
      walk.simple(ast, {
        FunctionDeclaration: checkNode, 
        FunctionExpression: checkNode,
        ArrowFunctionExpression: checkNode,
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
  