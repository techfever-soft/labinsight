import {
    LabInsightRule,
    LabInsightRuleOptions,
    LabInsightRuleResponse,
  } from "@interfaces/rule.interface";
  import * as acorn from "acorn";
  import * as walk from "acorn-walk";
  
  export class JSMaxArrayLengthRule implements LabInsightRule {
    private maxLength: number;
  
    constructor(options: LabInsightRuleOptions) {
      // Par défaut, on limite les tableaux à 100 éléments
      this.maxLength = options.options?.limit || 100;
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
  
      let response: LabInsightRuleResponse | null = null;
  
      const visitNode = (node: any): void => {
        if (node.type === "ArrayExpression") {
          const arrayLength = node.elements.length;
  
          if (arrayLength > this.maxLength) {
            const startLine = node.loc.start.line;
            response = {
              severity: "error",
              path: filePath,
              message: `Array exceeds the maximum allowed length of ${this.maxLength} elements. Total: ${arrayLength} elements.`,
              line: startLine,
            };
          }
        }
      };
  
      walk.simple(ast, {
        ArrayExpression: visitNode,
      });
  
      return response;
    }
  }
  