import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

export class JSRequireMethodDescriptionRule implements LabInsightRule {
  private options: LabInsightRuleOptions;
  private comments: any[] = [];

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse[]> {
    // Parse the file content with comments
    const ast = acorn.parse(fileContent, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true,
      onComment: (block, text, start, end, startLoc, endLoc) => {
        // Collect the comments for later use
        this.comments.push({
          type: block ? "Block" : "Line",
          value: text,
          start,
          end,
          loc: {
            start: startLoc,
            end: endLoc,
          },
        });
      },
    });

    return this.checkMethodDescriptions(ast, filePath);
  }

  private checkMethodDescriptions(
    ast: acorn.Node,
    filePath: string
  ): LabInsightRuleResponse[] {
    const responses: LabInsightRuleResponse[] = [];

    const checkNode = (node: any) => {
      if (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression" ||
        node.type === "MethodDefinition"
      ) {
        const methodName =
          node.id?.name || node.key?.name || "fonction anonyme";

        const hasJSDoc = this.hasJSDocComment(node);

        if (!hasJSDoc) {
          responses.push({
            severity: this.options.severity || "error",
            message: `The method '${methodName}' doesn't have a JSDoc description.`,
            path: filePath,
            line: node.loc.start.line,
          });
        }
      }

      // Recursively check the child nodes
      if (node.body && node.body.type === "BlockStatement") {
        node.body.body.forEach((childNode: any) => checkNode(childNode));
      }
    };

    // Traverse the AST
    walk.simple(ast, {
      FunctionDeclaration: checkNode,
      FunctionExpression: checkNode,
      ArrowFunctionExpression: checkNode,
      MethodDefinition: checkNode,
    });

    return responses;
  }

  private hasJSDocComment(node: any): boolean {
    const nodeStartLine = node.loc.start.line;

    // Check if there's a JSDoc comment just before the node
    return this.comments.some((comment) => {
      return (
        comment.type === "Block" &&
        comment.value.trim().startsWith("*") &&
        comment.loc.end.line === nodeStartLine - 1
      );
    });
  }
}
