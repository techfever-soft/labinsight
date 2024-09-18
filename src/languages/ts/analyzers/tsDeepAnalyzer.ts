import ts from "typescript";
import * as fs from "fs";
import { IAnalyzer } from "../../../interfaces/analyzer.interface";

export class TSDeepAnalyzer implements IAnalyzer {
  public async analyze(fileContent: string, filePath: string): Promise<any> {
    const sourceFile = ts.createSourceFile(
      filePath,
      fileContent,
      ts.ScriptTarget.Latest,
      true
    );

    return {
      complexity: this.calculateCyclomaticComplexity(sourceFile),
      cognitiveComplexity: this.calculateCognitiveComplexity(sourceFile),
      loc: this.countLinesOfCode(filePath),
      path: filePath,
    };
  }

  private calculateCyclomaticComplexity(sourceFile: ts.SourceFile): number {
    let complexity = 1;
    this.traverseNodes(sourceFile, (node) => {
      if (this.isComplexNode(node)) {
        complexity++;
      }
      if (ts.isSwitchStatement(node)) {
        complexity += node.caseBlock.clauses.length;
      }
    });
    return complexity;
  }

  private calculateCognitiveComplexity(sourceFile: ts.SourceFile): number {
    let complexity = 0;
    this.traverseNodes(sourceFile, (node, depth) => {
      if (this.isComplexNode(node) && depth) {
        complexity += 1 + depth;
      }
      if (this.isLogicalExpression(node)) {
        complexity += 0.5;
      }
    });
    return complexity;
  }

  private traverseNodes(
    node: ts.Node,
    callback: (node: ts.Node, depth?: number) => void,
    depth: number = 0
  ): void {
    callback(node, depth);
    ts.forEachChild(node, (child) =>
      this.traverseNodes(child, callback, depth + 1)
    );
  }

  private isComplexNode(node: ts.Node): boolean {
    return [
      ts.isIfStatement,
      ts.isForStatement,
      ts.isWhileStatement,
      ts.isDoStatement,
      ts.isSwitchStatement,
      ts.isConditionalExpression,
    ].some((check) => check(node));
  }

  private isLogicalExpression(node: ts.Node): boolean {
    return (
      ts.isBinaryExpression(node) &&
      [
        ts.SyntaxKind.AmpersandAmpersandToken,
        ts.SyntaxKind.BarBarToken,
      ].includes(node.operatorToken.kind)
    );
  }

  private countLinesOfCode(filePath: string): number {
    const content = fs.readFileSync(filePath, "utf-8");
    return content.split("\n").length;
  }
}
