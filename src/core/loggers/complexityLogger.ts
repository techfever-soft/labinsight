import chalk from "chalk";
import { LoggerUtil } from "@utils/loggerUtil";
import {
  CodeComplexityResult,
  AnalysisResult,
} from "@interfaces/analyzer.interface";

export class ComplexityLogger {
  private logger = new LoggerUtil();

  /**
   * Logs the code complexity result
   * @param result CodeComplexityResult
   * @returns void
   */
  public logCodeComplexityResult(result: CodeComplexityResult): void {
    this.logger.spacing();
    this.logComplexity(
      "Cyclomatic Complexity",
      result.totalComplexity,
      result.maxPossibleComplexity,
      result.fileCount
    );
    this.logComplexity(
      "Cognitive Complexity",
      result.totalCognitiveComplexity,
      result.maxPossibleCognitiveComplexity,
      result.fileCount
    );
  }

  /**
   * Logs the complexity of a type
   * @param type string
   * @param total number
   * @param maxPossible number
   * @param fileCount number
   * @returns void
   */
  private logComplexity(
    type: string,
    total: number,
    maxPossible: number,
    fileCount: number
  ): void {
    const average = fileCount > 0 ? total / fileCount : 0;
    const ratio = total / maxPossible;
    const evaluation = this.evaluateComplexity(ratio);

    console.log(chalk.bold(chalk.white(`${type}:`)));
    console.log(
      this.logger.getLineReturn() + `Total: ${total} / ${maxPossible}`
    );
    console.log(this.logger.getLineReturn() + `Average: ${average.toFixed(2)}`);
    console.log(this.logger.getLineReturn() + `Ratio: ${ratio.toFixed(2)}`);
    console.log(this.logger.getLineReturn() + `Evaluation: ${evaluation}`);
  }

  /**
   * Evaluates the complexity based on the ratio
   * @param ratio number
   * @returns string
   */
  private evaluateComplexity(ratio: number): string {
    if (ratio <= 0.3) return chalk.green("Good");
    if (ratio <= 0.6) return chalk.yellow("Average");
    return chalk.red("Poor");
  }

  /**
   * Logs the analysis results
   * @param result AnalysisResult
   * @returns void
   */
  public logAnalysisResults(result: AnalysisResult): void {
    this.logResult("Cyclomatic Complexity", result.complexity);
    this.logResult("Cognitive Complexity", result.cognitiveComplexity);
    this.logResult("Lines of Code", result.loc);
  }

  /**
   * Logs the result of a type
   * @param type string
   * @param value number
   * @returns void
   */
  private logResult(type: string, value: number): void {
    const coloredValue = this.getColorBasedOnComplexity(type, value);
    console.log(this.logger.getLineReturn() + `${type}: ${coloredValue}`);
  }

  /**
   * Gets the color based on the complexity
   * @param type string
   * @param value number
   * @returns string
   */
  private getColorBasedOnComplexity(type: string, value: number): string {
    switch (type) {
      case "Cyclomatic Complexity":
        return value <= 10
          ? chalk.green(value)
          : value <= 20
          ? chalk.yellow(value)
          : chalk.red(value);
      case "Cognitive Complexity":
        return value <= 15
          ? chalk.green(value)
          : value <= 30
          ? chalk.yellow(value)
          : chalk.red(value);
      case "Lines of Code":
        return value <= 50
          ? chalk.green(value)
          : value <= 100
          ? chalk.yellow(value)
          : chalk.red(value);
      default:
        return value.toString();
    }
  }
}
