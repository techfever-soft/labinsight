import {
  LabInsightRule,
  LabInsightRuleOptions,
  LabInsightRuleResponse,
} from "../../../../interfaces/rule.interface";
import ts from "typescript";

export class TSLimitTernaryOperatorRule implements LabInsightRule {
  private options: LabInsightRuleOptions;

  constructor(options: LabInsightRuleOptions) {
    this.options = options;
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

    const result = await this.checkTernaryOperatorCount(sourceFile);
    return result;
  }

  private async checkTernaryOperatorCount(
    sourceFile: ts.SourceFile
  ): Promise<LabInsightRuleResponse | null> {
    let ternaryOperatorCount = 0;

    const visit = (node: ts.Node) => {
      if (ts.isConditionalExpression(node)) {
        ternaryOperatorCount++;
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    if (ternaryOperatorCount > (this.options as any).limit) {
      return {
        severity: this.options.severity,
        path: sourceFile.fileName,
        message: `The number of ternary operators (${ternaryOperatorCount}) exceeds the limit of ${
          (this.options as any).limit
        }.`,
        line: 0,
        column: 0,
      };
    }

    return null;
  }
}
