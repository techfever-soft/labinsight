import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import * as acorn from "acorn";


export class JSRequireMethodDescriptionRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse[]> {
    const ast = acorn.parse(fileContent, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true, 
    });

    return this.checkMethodDescriptions(ast, filePath);
  }


  private checkMethodDescriptions(
    ast: acorn.Node,
    filePath: string
  ): LabInsightRuleResponse[] {
    let responses: LabInsightRuleResponse[] = [];

    const comments: any[] = (ast as any).comments || [];

    const checkNode = (node: any) => {
      if (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression" ||
        node.type === "MethodDefinition"
      ) {
        const methodName =
          node.id?.name || node.key?.name || "fonction anonyme";

        const hasJSDoc = this.hasJSDocComment(node, comments);

        if (!hasJSDoc) {
          responses.push({
            severity: this.options.severity || "error",
            message: `The method '${methodName}' doesn't have a JSDoc description.`,
            path: filePath,
            line: node.loc.start.line,
          });
        }
      }

      if (node.body && node.body.type === "BlockStatement") {
        node.body.body.forEach((childNode: any) => checkNode(childNode));
      }
    };

    (ast as any).body.forEach((node: any) => checkNode(node));

    return responses;
  }


  private hasJSDocComment(node: any, comments: any[]): boolean {
    const nodeStartLine = node.loc.start.line;

    return comments.some((comment: any) => {
      return (
        comment.type === "Block" &&
        comment.value.trim().startsWith("*") &&
        comment.loc.end.line === nodeStartLine - 1
      );
    });
  }
}
