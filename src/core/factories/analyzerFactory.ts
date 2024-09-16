import { IAnalyzer } from "@interfaces/analyzer.interface";
import { JSDeepAnalyzer } from "@languages/js/analyzers/jsDeepAnalyzer";
import { PyDeepAnalyzer } from "@languages/python/analyzers/pyDeepAnalyzer";
import { TSDeepAnalyzer } from "@languages/ts/analyzers/tsDeepAnalyzer";
import chalk from "chalk";

export class AnalyzerFactory {
  /**
   * Gets the analyzer based on the file extension
   * @param filePath string
   * @returns IAnalyzer | null
   */
  public static getAnalyzer(filePath: string): IAnalyzer | null {
    const extension = filePath.split(".").pop();

    if (extension === "js" || extension === "jsx") {
      return new JSDeepAnalyzer();
    }

    if (extension === "ts" || extension === "tsx") {
      return new TSDeepAnalyzer();
    }

    if (extension === "py") {
      console.log(chalk.red("Python deep analyzer not implemented yet"));
      // return new PyDeepAnalyzer();
    }

    return null;
  }
}
