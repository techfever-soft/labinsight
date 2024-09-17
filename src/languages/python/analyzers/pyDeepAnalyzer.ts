import { PyDirectoryAnalyzer } from "./pyDirectoryAnalyzer";
import fs from "fs";

export class PyDeepAnalyzer {
  public async analyze(fileContent: string, filePath: string): Promise<any> {
    const pyDirectoryAnalyzer = new PyDirectoryAnalyzer();
    const ast = await pyDirectoryAnalyzer.analyzePythonFile(filePath);

    return {
      complexity: this.calculateCyclomaticComplexity(ast),
      cognitiveComplexity: this.calculateCognitiveComplexity(ast),
      loc: this.countLinesOfCode(filePath),
      path: filePath,
    };
  }

  private calculateCyclomaticComplexity(ast: any): number {
    let complexity = 1;

    const visitNode = (node: any) => {
      if (
        [
          "If",
          "For",
          "While",
          "Try",
          "FunctionDef",
          "AsyncFunctionDef",
        ].includes(node._type)
      ) {
        complexity++;
      }
      if (node._type === "Match") {
        complexity += node.cases.length;
      }
    };

    this.traverseAst(ast, visitNode);
    return complexity;
  }

  private calculateCognitiveComplexity(ast: any): number {
    let complexity = 0;

    const visitNode = (node: any, depth: number) => {
      if (
        [
          "If",
          "For",
          "While",
          "Try",
          "FunctionDef",
          "AsyncFunctionDef",
        ].includes(node._type)
      ) {
        complexity += 1 + depth;
      }
      if (node._type === "BoolOp") {
        complexity += 0.5;
      }
    };

    this.traverseAst(ast, visitNode);
    return complexity;
  }

  private traverseAst(
    node: any,
    callback: (node: any, depth: number) => void,
    depth: number = 0
  ): void {
    callback(node, depth);
    if (node.body && Array.isArray(node.body)) {
      node.body.forEach((childNode: any) =>
        this.traverseAst(childNode, callback, depth + 1)
      );
    }
  }

  private countLinesOfCode(filePath: string): number {
    const content = fs.readFileSync(filePath, "utf-8");
    return content.split("\n").length;
  }
}
