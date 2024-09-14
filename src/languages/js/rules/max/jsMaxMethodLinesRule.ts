import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

export class JSMaxMethodLinesRule implements LabInsightRule {
  private maxLines: number;

  constructor(options: LabInsightRuleOptions) {
    this.maxLines = options.options?.limit || 200;
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse | null> {
    const ast = acorn.parse(fileContent, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true,
    });

    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: any): void => {
      // Vérifie si le nœud est une méthode dans une classe ou un objet
      if (
        node.type === "MethodDefinition" || 
        (node.type === "Property" && node.value.type === "FunctionExpression")
      ) {
        const startLine = node.loc.start.line;
        const endLine = node.loc.end.line;
        const totalLines = endLine - startLine;

        if (totalLines > this.maxLines) {
          response = {
            severity: "error",
            path: filePath,
            message: `The method has reached ${this.maxLines} lines. Total: ${totalLines} lines.`,
            line: startLine,
          };
        }
      }
    };

    walk.simple(ast, {
      MethodDefinition: visitNode,
      Property: visitNode, // Pour les méthodes dans les objets littéraux
    });

    return response;
  }
}
