import {
    LabInsightRule,
    LabInsightRuleOptions,
    LabInsightRuleResponse,
  } from "../../../../interfaces/rule.interface";
  import * as acorn from "acorn";
  import * as walk from "acorn-walk";
  
  export class JSParameterCasingRule implements LabInsightRule {
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
  
      const result = this.checkParameterCasing(ast, filePath);
  
      return result;
    }
  
    private checkParameterCasing(
      ast: acorn.Node,
      filePath: string
    ): LabInsightRuleResponse | null {
      let response: LabInsightRuleResponse | null = null;
  
      const checkNode = (node: any) => {
        if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
          node.params.forEach((param: any) => {
            if (param.name && !this.isValidCasing(param.name)) {
              const line = param.loc?.start.line;
  
              response = {
                severity: this.options.options?.severity,
                message: `Parameter "${param.name}" does not follow the ${this.options.options?.casing} naming convention.`,
                path: filePath,
                line: line || 0,
              };
            }
          });
        }
      };
  
      walk.simple(ast, {
        FunctionDeclaration: checkNode, 
        FunctionExpression: checkNode, 
        ArrowFunctionExpression: checkNode,
      });
  
      return response;
    }
  
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
  