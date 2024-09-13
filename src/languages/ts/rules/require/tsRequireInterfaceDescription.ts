import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import ts from "typescript";

export class TSRequireInterfaceDescriptionRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(private optionsMap: LabInsightRuleOptions) {
    this.options = optionsMap;
  }

  /**
   * Applies the rule to the file content
   * @param fileContent string
   * @param filePath string
   * @returns Promise<LabInsightRuleResponse | null>
   */
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

    const result = this.analyzeInterfaceDescription(sourceFile, filePath);

    return result;
  }

  /**
   * Analyzes if the interface has a description comment above it
   * @param sourceFile ts.SourceFile
   * @param filePath string
   * @returns LabInsightRuleResponse | null
   */
  private analyzeInterfaceDescription(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isInterfaceDeclaration(node) && node.name) {
        const interfaceName = node.name.getText();
        const hasComment = this.hasDescriptionComment(node, sourceFile);

        if (!hasComment) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );
          response = {
            severity: this.options.severity,
            message: `Interface '${interfaceName}' is missing a JSDoc description.`,
            path: filePath,
            line,
          };
        }
      }
    };

    sourceFile.forEachChild(visitNode);

    return response;
  }

  /**
   * Checks if the node has a description comment
   * @param node ts.Node
   * @param sourceFile ts.SourceFile
   * @returns boolean
   */
  private hasDescriptionComment(
    node: ts.Node,
    sourceFile: ts.SourceFile
  ): boolean {
    const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const comment = this.getCommentBeforeLine(line, sourceFile);

    return comment !== null && comment.includes("/**");
  }

  /**
   * Gets the comment before a line
   * @param line number
   * @param sourceFile ts.SourceFile
   * @returns string | null
   */
  private getCommentBeforeLine(
    line: number,
    sourceFile: ts.SourceFile
  ): string | null {
    const text = sourceFile.getFullText();
    const lines = text.split("\n");

    for (let i = line - 1; i >= 0; i--) {
      if (lines[i].trim().startsWith("/**")) {
        return lines[i].trim();
      }
    }

    return null;
  }
}
