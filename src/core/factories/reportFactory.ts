import { BasicAnalyzer } from "@core/analyzers/basicAnalyzer";
import { DeepAnalyzer } from "@core/analyzers/deepAnalyzer";
import { DependencyAnalyzer } from "@core/analyzers/dependencyAnalyzer";
import { AnalysisResult } from "@interfaces/analyzer.interface";
import {
  BasicReport,
  DeepReport,
  DependencyReport,
} from "@interfaces/report.interface";
import { LabInsightRuleResponse } from "@interfaces/rule.interface";
import { LabInsightArgType } from "@lab-types/arg.type";

export class ReportFactory {
  private deepReport!: DeepReport;
  private basicReport!: BasicReport;
  private dependencyReport!: DependencyReport;

  /**
   * Gets the deep report
   * @returns DeepReport
   */
  public getDeepReport(): DeepReport {
    return this.deepReport;
  }

  /**
   * Gets the basic report
   * @returns BasicReport
   */
  public getBasicReport(): BasicReport {
    return this.basicReport;
  }

  /**
   * Gets the dependency report
   * @returns DependencyReport
   */
  public getDependencyReport() {
    return this.dependencyReport;
  }

  /**
   * Builds the report based on the type
   * @param type LabInsightArgType
   * @returns Promise<void>
   */
  public async buildReport(type: LabInsightArgType) {
    switch (type) {
      case "deep":
        await this.buildDeepReport();
        break;
      case "basic":
        await this.buildBasicReport();
        break;
      case "dependencies":
        await this.buildDependenciesReport();
        break;
    }
  }

  /**
   * Builds the dependencies report
   * @returns Promise<void>
   */
  private async buildDependenciesReport(): Promise<void> {
    const dependencyAnalyzer = new DependencyAnalyzer();
    await dependencyAnalyzer.analyze();

    const report = dependencyAnalyzer.getDependenciesReport();

    this.dependencyReport = report;
  }

  /**
   * Builds the basic report
   * @returns Promise<void>
   */
  private async buildBasicReport(): Promise<void> {
    const basicAnalyzer = new BasicAnalyzer();
    await basicAnalyzer.analyze();

    const fileResults = basicAnalyzer.getFilesResult();

    let fileResultsFinal: LabInsightRuleResponse[] = [];

    fileResults.forEach(async (fileResult) => {
      const ansiRegex =
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

      const resettedMessage = fileResult.message.replace(ansiRegex, "");
      fileResultsFinal.push({
        ...fileResult,
        message: resettedMessage,
      });
    });

    this.basicReport = {
      files: fileResultsFinal,
    };
  }

  /**
   * Builds the deep report
   * @returns Promise<void>
   */
  private async buildDeepReport(): Promise<void> {
    const deepAnalyzer = new DeepAnalyzer();
    await deepAnalyzer.analyze();
    await deepAnalyzer.calculateCodeComplexityResult();

    const codeComplexity = await deepAnalyzer.getCodeComplexityResult();
    const fileResults = await deepAnalyzer.getFilesResult();

    let fileResultsFinal: AnalysisResult[] = [];

    fileResults.forEach((fileResult) => {
      fileResultsFinal.push(fileResult);
    });

    const report: DeepReport = {
      files: fileResultsFinal,
      complexity: codeComplexity,
    };

    this.deepReport = report;
  }
}
