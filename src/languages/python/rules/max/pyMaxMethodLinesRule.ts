import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import { PyDirectoryAnalyzer } from "../../../../languages/python/analyzers/pyDirectoryAnalyzer";
import * as fs from "fs"; // Node.js file system module

export class PyMaxMethodLines implements LabInsightRule {
  private limit: number;

  constructor(private options: LabInsightRuleOptions) {
    this.limit = options.options?.limit || 50; // Default limit if not provided
  }

  public async apply(
    fileContent: string,
    filePath: string
  ): Promise<LabInsightRuleResponse | LabInsightRuleResponse[] | null> {
    const pyDirectoryAnalyzer = new PyDirectoryAnalyzer();
    const ast = await pyDirectoryAnalyzer.analyzePythonFile(filePath);

    // Read the file to get the actual lines
    const fileLines = fs.readFileSync(filePath, "utf-8").split("\n");

    return this.checkMethodLines(ast, filePath, fileLines);
  }

  /**
   * Check if methods in the AST exceed the specified line limit
   * @param ast The AST of the Python file
   * @param filePath The path of the analyzed file
   * @param fileLines Array of lines in the source file
   * @returns LabInsightRuleResponse[]
   */
  private checkMethodLines(
    ast: any,
    filePath: string,
    fileLines: string[]
  ): LabInsightRuleResponse[] {
    const responses: LabInsightRuleResponse[] = [];

    // Helper function to check each method in the class body
    const checkClassNode = (node: any) => {
      if (node._type === "ClassDef") {
        const className = node.name || "anonymous class";

        // Traverse the body of the class to find methods (FunctionDef)
        node.body.forEach((classBodyNode: any) => {
          if (classBodyNode._type === "FunctionDef") {
            const methodName = classBodyNode.name || "anonymous method";

            // Find the start of the method in the source file by name match
            const startLine = this.findMethodStartLine(fileLines, methodName);
            const endLine = this.findMethodEndLine(fileLines, startLine);

            const totalLines = endLine - startLine + 1; // Calculate total lines

            // If the method exceeds the max lines, add it to the response
            if (totalLines > this.limit) {
              responses.push({
                severity: this.options.severity || "error",
                message: `Method '${methodName}' in class '${className}' exceeds the maximum allowed lines of ${this.limit}. Total lines: ${totalLines}`,
                path: filePath,
                line: startLine + 1,
              });
            }
          }
        });
      }
    };

    // Traverse the AST to check each class
    if (ast._type === "Module" && ast.body) {
      ast.body.forEach((node: any) => checkClassNode(node));
    }

    return responses;
  }

  /**
   * Finds the start line of a method by looking for the method name in the source file
   * @param fileLines Array of lines in the source file
   * @param methodName The name of the method
   * @returns The line number where the method starts
   */
  private findMethodStartLine(fileLines: string[], methodName: string): number {
    for (let i = 0; i < fileLines.length; i++) {
      const line = fileLines[i].trim();

      // Look for 'def <methodName>('
      if (line.startsWith(`def ${methodName}(`)) {
        return i;
      }
    }
    return -1; // If method is not found, return -1
  }

  /**
   * Finds the end line of a method by checking indentation or body size
   * @param fileLines Array of lines in the source file
   * @param startLine The starting line of the method
   * @returns The line number where the method ends
   */
  private findMethodEndLine(fileLines: string[], startLine: number): number {
    let currentLine = startLine + 1;
    const methodIndentation = this.getIndentationLevel(fileLines[startLine]);

    // Iterate through lines to find the end of the method (when indentation decreases or body ends)
    while (currentLine < fileLines.length) {
      const line = fileLines[currentLine];

      // Stop if the indentation level changes or we hit an empty line (method end)
      if (
        line.trim() === "" ||
        this.getIndentationLevel(line) <= methodIndentation
      ) {
        break;
      }

      currentLine++;
    }

    return currentLine - 1;
  }

  /**
   * Returns the indentation level of a line
   * @param line A line of code from the source file
   * @returns The number of leading spaces (indentation level)
   */
  private getIndentationLevel(line: string): number {
    return line.length - line.trimStart().length;
  }
}
