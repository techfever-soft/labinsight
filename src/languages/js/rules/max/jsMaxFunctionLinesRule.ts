import {
    LabInsightRule,
    LabInsightRuleOptions,
    LabInsightRuleResponse,
  } from "@interfaces/rule.interface";
  import * as acorn from "acorn";
  import * as walk from "acorn-walk";
  
  export class JSMaxFunctionLinesRule implements LabInsightRule {
    private maxLines: number;
  
    constructor(options: LabInsightRuleOptions) {
      this.maxLines = options.options?.limit || 200;
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
        // Vérifie si le nœud est une fonction, mais pas une méthode
        if (
          node.type === "FunctionDeclaration" ||
          node.type === "FunctionExpression" ||
          node.type === "ArrowFunctionExpression"
        ) {
          const startLine = node.loc.start.line;
          const endLine = node.loc.end.line;
          const totalLines = endLine - startLine;
  
          if (totalLines > this.maxLines) {
            response = {
              severity: "error",
              path: filePath,
              message: `The function has reached ${this.maxLines} lines. Total: ${totalLines} lines.`,
              line: startLine,
            };
          }
        }
      };
  
      walk.simple(ast, {
        FunctionDeclaration: visitNode,
        FunctionExpression: visitNode,
        ArrowFunctionExpression: visitNode,
      });
  
      return response;
    }
  }
  