import {
  LabInsightRule,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import ts from "typescript";

export class TSMaxMethodLinesRule implements LabInsightRule {
  private limit: number;

  constructor(options: any) {
    this.limit = options.options?.limit;
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

    const result = this.analyzeMethodLines(sourceFile, filePath);

    return result;
  }

  private analyzeMethodLines(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visit = (node: ts.Node) => {
      // Vérifier si le nœud est une méthode de classe
      if (ts.isMethodDeclaration(node) && node.name) {
        const { line: startLine } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart()
        );
        const { line: endLine } = sourceFile.getLineAndCharacterOfPosition(
          node.getEnd()
        );

        const methodLines = endLine - startLine + 1;

        if (methodLines > this.limit) {
          const methodName = (node.name as ts.Identifier).text;

          response = {
            path: filePath,
            message: `The method '${methodName}' has ${methodLines} lines, which exceeds the limit of ${this.limit} lines.`,
            severity: "error",
          };
        }
      }

      // Parcourir les enfants du nœud
      ts.forEachChild(node, visit);
    };

    // Parcourir tout le fichier source
    ts.forEachChild(sourceFile, visit);

    return response;
  }
}
