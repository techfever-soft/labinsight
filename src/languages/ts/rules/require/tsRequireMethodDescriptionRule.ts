import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";

export class TSRequireMethodDescriptionRule implements LabInsightRule {
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

    const result = this.analyzeMethodDescription(sourceFile, filePath);

    return result;
  }

  /**
   * Analyzes if the method has a description comment above it
   * @param sourceFile ts.SourceFile
   * @param filePath string
   * @returns LabInsightRuleResponse | null
   */
  private analyzeMethodDescription(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isMethodDeclaration(node) && node.name) {
        const methodName = node.name.getText();
        const hasComment = this.hasDescriptionComment(node, sourceFile);

        if (!hasComment) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );
          response = {
            severity: this.options.severity,
            message: `Method '${methodName}' is missing a JSDoc description.`,
            path: filePath,
            line: line + 1,
          };
        }
      }

      // Parcours des nœuds enfants
      ts.forEachChild(node, visitNode);
    };

    visitNode(sourceFile);

    return response;
  }

  /**
   * Checks if a method has a comment description above it
   * @param node ts.Node
   * @param sourceFile ts.SourceFile
   * @returns boolean
   */
  private hasDescriptionComment(
    node: ts.Node,
    sourceFile: ts.SourceFile
  ): boolean {
    const comments = ts.getLeadingCommentRanges(
      sourceFile.getFullText(),
      node.getFullStart()
    );

    if (comments) {
      return comments.some((comment) => {
        const commentText = sourceFile
          .getFullText()
          .substring(comment.pos, comment.end)
          .trim();

        return commentText.startsWith("/**");
      });
    }

    return false;
  }
}
