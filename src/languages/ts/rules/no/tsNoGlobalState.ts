import ts from "typescript";
import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "@interfaces/rule.interface";

/**
 * Rule to prevent the use of global state in TypeScript files, except when exported
 */
export class TSNoGlobalStateRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
  }

  /**
   * Applies the rule to check for global state
   * @param fileContent string
   * @param filePath string
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

    const result = this.checkGlobalState(sourceFile, filePath);

    return result;
  }

  /**
   * Checks for global variables and objects that are not scoped inside functions or classes
   * and are not exported
   * @param sourceFile ts.SourceFile
   * @param filePath string
   */
  private checkGlobalState(
    sourceFile: ts.SourceFile,
    filePath: string
  ): LabInsightRuleResponse | null {
    let response: LabInsightRuleResponse | null = null;

    const visitNode = (node: ts.Node): void => {
      // Check for variable declarations not inside a function or class and not exported
      if (
        ts.isVariableDeclaration(node) &&
        this.isGlobalScope(node, sourceFile) &&
        !this.isExported(node)
      ) {
        const variableName = (node.name as ts.Identifier).text;
        const { line } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart()
        );

        response = {
          severity: this.options.severity,
          message: `Global variable "${variableName}" detected, avoid using global state.`,
          path: filePath,
          line: line + 1,
        };
      }

      ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(sourceFile, visitNode);

    return response;
  }

  /**
   * Checks if a node is defined in the global scope (not inside a function or class)
   * @param node ts.Node
   * @param sourceFile ts.SourceFile
   * @returns boolean
   */
  private isGlobalScope(node: ts.Node, sourceFile: ts.SourceFile): boolean {
    let parent = node.parent;

    while (parent) {
      if (
        ts.isFunctionDeclaration(parent) ||
        ts.isClassDeclaration(parent) ||
        ts.isModuleDeclaration(parent)
      ) {
        return false; // Node is inside a function, class, or module
      }
      parent = parent.parent;
    }

    return true; // Node is in global scope
  }

  /**
   * Checks if the variable is exported
   * @param node ts.Node
   * @returns boolean
   */
  private isExported(node: ts.Node): boolean {
    let parent = node.parent;

    while (parent) {
      if (ts.isVariableStatement(parent)) {
        return parent.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
        ) as boolean;
      }
      parent = parent.parent;
    }

    return false; // Variable is not exported
  }
}
