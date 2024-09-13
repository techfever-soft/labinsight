import {
  LabInsightRule,
  LabInsightRuleConfig,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import ts from "typescript";

export class TSRequireClassDescriptionRule implements LabInsightRule {
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

    const result = this.analyzeClassDescription(sourceFile, filePath);

    return result;
  }

  /**
   * Analyzes if the class has a description comment above it
   * @param sourceFile ts.SourceFile
   * @param filePath string
   * @returns LabInsightRuleResponse | null
   */
  private analyzeClassDescription(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      if (ts.isClassDeclaration(node) && node.name) {
        const className = node.name.getText();
        const hasComment = this.hasDescriptionComment(node, sourceFile);

        if (!hasComment) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );
          response = {
            severity: this.optionsMap.severity,
            message: `Class '${className}' is missing a JSDoc description.`,
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
    const comments = ts.getLeadingCommentRanges(
      sourceFile.text,
      node.getFullStart() + 1
    );
    if (!comments) {
      return false;
    }

    const comment = comments.find((comment) => {
      const { line: commentLine } = sourceFile.getLineAndCharacterOfPosition(
        comment.pos
      );
      return commentLine === line - 1;
    });

    return !!comment;
  }
}
