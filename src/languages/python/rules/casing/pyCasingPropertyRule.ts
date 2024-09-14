import {
    LabInsightRule,
    LabInsightRuleOptions,
    LabInsightRuleResponse,
  } from "@interfaces/rule.interface";
  import { PyDirectoryAnalyzer } from "@languages/python/analyzers/pyDirectoryAnalyzer";
  
  export class PyCasingPropertyRule implements LabInsightRule {
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
  
      return this.checkPropertyCasing(ast, filePath);
    }
  
    private checkPropertyCasing(ast: any, filePath: string): LabInsightRuleResponse[] {
      let responses: LabInsightRuleResponse[] = [];
  
      const checkNode = (node: any) => {
        if (node._type === "Assign" && node.targets[0]?._type === "Name") {
          const propertyName = node.targets[0].id;
  
          if (propertyName && !this.isValidCasing(propertyName)) {
            responses.push({
              severity: "error",
              message: `Property "${propertyName}" does not follow the ${this.options.options?.casing} naming convention.`,
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
  