import { IAnalyzer } from "../../../interfaces/analyzer.interface";
import * as acorn from "acorn";
import * as fs from "fs";

export class JSDeepAnalyzer implements IAnalyzer {
  public async analyze(fileContent: string, filePath: string): Promise<any> {
    const ast = acorn.parse(fileContent, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true,
      ranges: true,
    });

    return {
      complexity: this.calculateCyclomaticComplexity(ast),
      cognitiveComplexity: this.calculateCognitiveComplexity(ast),
      loc: this.countLinesOfCode(filePath),
      path: filePath,
    };
  }

  private calculateCyclomaticComplexity(ast: any): number {
    let complexity = 1; // Initial cyclomatic complexity
    this.traverseNodes(ast, (node) => {
      if (this.isComplexNode(node)) complexity++;
      if (node.type === "SwitchStatement" && node.cases) {
        complexity += node.cases.length;
      }
    });
    return complexity;
  }

  private calculateCognitiveComplexity(ast: any): number {
    let complexity = 0;
    this.traverseNodes(ast, (node, depth) => {
      if (this.isComplexNode(node) && depth) complexity += 1 + depth;
      if (node.type === "LogicalExpression" && depth) complexity += depth;
    });
    return complexity;
  }

  private traverseNodes(
    node: any,
    callback: (node: any, depth?: number) => void,
    depth: number = 0
  ): void {
    callback(node, depth);
    if (node.body) {
      this.traverseBody(node.body, (child) =>
        this.traverseNodes(child, callback, depth + 1)
      );
    }
  }

  private traverseBody(body: any, visitFn: (node: any) => void): void {
    if (Array.isArray(body)) {
      body.forEach(visitFn);
    } else {
      visitFn(body);
    }
  }

  private isComplexNode(node: any): boolean {
    return [
      "IfStatement",
      "ForStatement",
      "WhileStatement",
      "SwitchStatement",
      "DoWhileStatement",
      "CaseClause",
      "ConditionalExpression",
    ].includes(node.type);
  }

  private countLinesOfCode(filePath: string): number {
    const content = fs.readFileSync(filePath, "utf-8");
    return content.split("\n").length;
  }
}
