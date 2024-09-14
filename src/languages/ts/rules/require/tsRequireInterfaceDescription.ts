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
          const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          response = {
            severity: this.options.severity,
            message: `Interface '${interfaceName}' is missing a JSDoc description.`,
            path: filePath,
            line: line + 1,
          };
        }
      }
    };

    ts.forEachChild(sourceFile, visitNode);

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
    const comments = ts.getLeadingCommentRanges(sourceFile.getFullText(), node.getFullStart());

    if (comments) {
      return comments.some((comment) => {
        const commentText = sourceFile.getFullText().slice(comment.pos, comment.end).trim();
        return commentText.startsWith("/**");
      });
    }

    return false;
  }
}
