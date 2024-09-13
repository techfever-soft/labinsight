import {
    LabInsightRule,
    LabInsightRuleOptions,
    LabInsightRuleResponse,
  } from "@interfaces/rule.interface";
  import * as ts from "typescript";
  
  export class TSFunctionCasingRule implements LabInsightRule {
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
  
      const result = this.checkFunctionCasing(sourceFile, filePath);
  
      return result;
    }
  
    private checkFunctionCasing(
      sourceFile: ts.SourceFile,
      filePath: string
    ): LabInsightRuleResponse | null {
      let response: LabInsightRuleResponse | null = null;
  
      const checkNode = (node: ts.Node): void => {
        if (
          ts.isFunctionDeclaration(node) || 
          ts.isFunctionExpression(node) || 
          ts.isArrowFunction(node)
        ) {
          const functionName = node.name?.text;
  
          if (functionName && !this.isValidCasing(functionName)) {
            const { line } = sourceFile.getLineAndCharacterOfPosition(
              node.getStart()
            );
  
            response = {
              severity: this.options.options?.severity,
              message: `Function "${functionName}" does not follow the ${this.options.options?.casing} naming convention.`,
              path: filePath,
              line: line + 1,
            };
          }
        }
  
        ts.forEachChild(node, checkNode); // Traverse the AST recursively
      };
  
      ts.forEachChild(sourceFile, checkNode);
  
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
  