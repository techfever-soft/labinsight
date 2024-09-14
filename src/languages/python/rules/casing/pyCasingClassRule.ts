import {
    LabInsightRule,
    LabInsightRuleOptions,
    LabInsightRuleResponse,
  } from "@interfaces/rule.interface";
  import { PyDirectoryAnalyzer } from "@languages/python/analyzers/pyDirectoryAnalyzer";
  
  export class PyCasingClassRule implements LabInsightRule {
    private options: LabInsightRuleOptions;
  
    constructor(options: LabInsightRuleOptions) {
      this.options = options;
    }
  
    public async apply(
      fileContent: string,
      filePath: string
    ): Promise<LabInsightRuleResponse | LabInsightRuleResponse[] | null> {
      const pyDirectoryAnalyzer = new PyDirectoryAnalyzer();
      const ast = await pyDirectoryAnalyzer.analyzePythonFile(filePath);
  
      return this.checkClassCasing(ast, filePath);
    }
  
    private checkClassCasing(ast: any, filePath: string): LabInsightRuleResponse[] {
      let responses: LabInsightRuleResponse[] = [];
  
      const checkNode = (node: any) => {
        if (node._type === "ClassDef") {
          const className = node.name;
  
          if (className && !this.isValidCasing(className)) {
            responses.push({
              severity: "error",
              message: `Class "${className}" does not follow the ${this.options.options?.casing} naming convention.`,
              path: filePath,
              line: node.lineno || 0,
            });
          }
        }
  
        if (node.body) {
          node.body.forEach((childNode: any) => checkNode(childNode));
        }
      };
  
      if (ast.body) {
        ast.body.forEach((node: any) => checkNode(node));
      }
  
      return responses;
    }
  
    private isValidCasing(name: string): boolean {
      switch (this.options.options?.casing) {
        case "camelCase":
          return /^[a-z][a-zA-Z0-9]*$/.test(name);
        case "snake_case":
          return /^[a-z][a-z0-9_]*$/.test(name);
        case "PascalCase":
          return /^[A-Z][a-zA-Z0-9]*$/.test(name);
        case "UPPER_CASE":
          return /^[A-Z][A-Z0-9_]*$/.test(name);
        default:
          return true;
      }
    }
  }
  