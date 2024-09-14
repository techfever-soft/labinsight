import {
  LabInsightRule,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import ts from "typescript";

export class TSMaxEnumLinesRule implements LabInsightRule {
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

    const result = this.analyzeEnumLines(sourceFile, filePath);

    return result;
  }

  private analyzeEnumLines(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visit = (node: ts.Node) => {
      if (ts.isEnumDeclaration(node)) {
        const { line: startLine } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart()
        );
        const { line: endLine } = sourceFile.getLineAndCharacterOfPosition(
          node.getEnd()
        );

        const enumLines = endLine - startLine + 1;

        if (enumLines > this.limit) {
          response = {
            path: filePath,
            message: `The enum has ${enumLines} lines, which is more than the allowed limit of ${this.limit} lines`,
            severity: "error",
          };
        }
      }

      ts.forEachChild(node, visit);
    };

    ts.forEachChild(sourceFile, visit);

    return response;
  }
}
