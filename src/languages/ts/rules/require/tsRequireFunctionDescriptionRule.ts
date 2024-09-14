import {
  LabInsightRule,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import ts from "typescript";

export class TSRequireFunctionDescriptionRule implements LabInsightRule {
  constructor(options: any) {
    // Pas de limite à définir dans cette règle, donc pas besoin d'options spécifiques
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

    const result = this.analyzeFunctionDescriptions(
      sourceFile,
      fileContent,
      filePath
    );

    return result;
  }

  private analyzeFunctionDescriptions(
    sourceFile: ts.SourceFile,
    fileContent: string,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visit = (node: ts.Node) => {
      // Identifier les fonctions, y compris les fléchées
      if (
        ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node)
      ) {
        const hasComment = this.hasValidComment(node, sourceFile, fileContent);

        if (!hasComment) {
          const functionName = this.getFunctionName(node);
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart()
          );

          response = {
            path: filePath,
            message: `La fonction ou méthode '${functionName}' doit avoir une description (commentaire) au-dessus de la déclaration.`,
            severity: "warning",
            line: line + 1,
          };
        }
      }

      // Vérifier les variables qui contiennent des fonctions fléchées
      if (ts.isVariableDeclaration(node) && node.initializer) {
        if (ts.isArrowFunction(node.initializer)) {
          const hasComment = this.hasValidComment(
            node,
            sourceFile,
            fileContent
          );

          if (!hasComment) {
            const functionName = node.name.getText();
            const { line } = sourceFile.getLineAndCharacterOfPosition(
              node.getStart()
            );

            response = {
              path: filePath,
              message: `La fonction fléchée '${functionName}' doit avoir une description (commentaire) au-dessus de la déclaration.`,
              severity: "warning",
              line: line + 1,
            };
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    ts.forEachChild(sourceFile, visit);

    return response;
  }

  private hasValidComment(
    node: ts.Node,
    sourceFile: ts.SourceFile,
    fileContent: string
  ): boolean {
    const leadingComments = ts.getLeadingCommentRanges(
      fileContent,
      node.getFullStart()
    );

    if (leadingComments && leadingComments.length > 0) {
      const lastComment = leadingComments[leadingComments.length - 1];
      const { line: commentEndLine } = sourceFile.getLineAndCharacterOfPosition(
        lastComment.end
      );
      const { line: startLine } = sourceFile.getLineAndCharacterOfPosition(
        node.getStart()
      );

      // Vérifier si le commentaire est immédiatement au-dessus de la fonction
      if (commentEndLine === startLine - 1) {
        const commentText = fileContent
          .slice(lastComment.pos, lastComment.end)
          .trim();
        return commentText.startsWith("/**") || commentText.startsWith("//");
      }
    }

    return false;
  }

  private getFunctionName(node: ts.Node): string {
    if (ts.isFunctionDeclaration(node) && node.name) {
      return node.name.text;
    }

    if (ts.isVariableDeclaration(node.parent)) {
      return node.parent.name.getText();
    }

    return "anonymous";
  }
}
