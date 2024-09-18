import chalk from "chalk";
import { BasicLogger } from "../loggers/basicLogger";
import { exec } from "child_process";
import { LabInsightRuleResponse } from "../../interfaces/rule.interface";
import { CustomRuleLoader } from "../loaders/customRuleLoader";
import { ArgManager } from "../managers/argManager";
import { FileManager } from "../managers/fileManager";
import { RuleManager } from "../managers/ruleManager";

export class BasicAnalyzer {
  private fileManager = new FileManager();
  private ruleManager = new RuleManager();
  private fileResults: Set<LabInsightRuleResponse> = new Set();
  private pythonInstalled: boolean | null = null;

  /**
   * Gets the results of the analysis
   * @returns Set<LabInsightRuleResponse>
   */
  public getFilesResult(): Set<LabInsightRuleResponse> {
    return this.fileResults;
  }

  /**
   * Analyzes the files in the current directory
   * @returns Promise<void>
   */
  public async analyze(): Promise<void> {
    const filePath = process.cwd();
    const files = this.fileManager.getDirectoryFiles(filePath);

    this.pythonInstalled = await this.isPythonInstalled();

    const argManager = new ArgManager();
    const onlyLanguage = argManager.getArgs().only;

    for (const file of files) {
      if (onlyLanguage) {
        if (!file.endsWith("." + onlyLanguage)) {
          continue;
        }
      }

      console.log(`📄 Analyzing file ${chalk.italic(chalk.grey(file))}`);

      await this.analyzeFile(file);
    }
  }

  /**
   * Analyzes a file
   * @param file string
   */
  private async analyzeFile(file: string): Promise<void> {
    try {
      const fileContent = await this.fileManager.readFile(file);
      const rules = await this.getCombinedRules(file);

      for (const { ruleName, rule } of rules) {
        if (!this.pythonInstalled && ruleName.startsWith("py.")) {
          console.error(
            `Python is required to run rule ${ruleName} but it is not installed. Skipping rule.`
          );
        }

        await this.applyRule(ruleName, rule, fileContent, file);
      }
    } catch (error) {
      console.error(`Error analyzing file ${file}:`, error);
    }
  }

  private async isPythonInstalled(): Promise<boolean> {
    return new Promise((resolve) => {
      const command = process.platform === "win32" ? "where" : "which";
      exec(`${command} python`, (error, stdout, stderr) => {
        if (error || stderr) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Gets the combined rules from the configuration and custom rules
   * @param file string
   * @returns Promise<{ ruleName: string; rule: any }[]>
   */
  private async getCombinedRules(
    file: string
  ): Promise<{ ruleName: string; rule: any }[]> {
    const configRules = await this.ruleManager.getRules(file);
    const customRules = await CustomRuleLoader.loadCustomRules();

    const wrappedCustomRules = customRules.map((customRule) => ({
      ruleName: customRule.constructor.name,
      rule: customRule,
    }));

    return [...configRules, ...wrappedCustomRules];
  }

  /**
   * Applies a rule to a file
   * @param ruleName string
   * @param rule any
   * @param fileContent string
   * @param file string
   * @returns Promise<void>
   */
  private async applyRule(
    ruleName: string,
    rule: any,
    fileContent: string,
    file: string
  ): Promise<void> {
    try {
      const result = await rule.apply(fileContent, file);

      if (result) {
        if (Array.isArray(result)) {
          result.forEach((res) => {
            this.fileResults.add(res);
          });
        } else {
          this.fileResults.add(result);
        }

        const basicLogger = new BasicLogger();
        basicLogger.logResult(ruleName, rule, result);
      }
    } catch (error) {
      console.error(`Error applying rule ${ruleName} to file ${file}:`, error);
    }
  }
}
