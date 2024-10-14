import { LabInsightRule } from "src/interfaces/rule.interface";

export class JSLimitTernaryOperatorRule implements LabInsightRule {
  public async apply(fileContent: string, filePath: string): Promise<any> {
    return [];
  }
}