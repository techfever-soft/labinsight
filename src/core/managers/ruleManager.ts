import * as path from "path";
import { ConfigManager } from "../../config/configManager";
import { LabInsightRule } from "../../interfaces/rule.interface";
import { jsRules } from "../../languages/js/jsRules";
import { pyRules } from "../../languages/python/pyRules";
import { tsRules } from "../../languages/ts/tsRules";


export class RuleManager {
  private configManager: ConfigManager;
  private rules: Set<{ ruleName: string; rule: LabInsightRule }> = new Set();

  constructor() {
    this.configManager = new ConfigManager();
  }

  public async getRules(
    filePath: string
  ): Promise<{ ruleName: string; rule: LabInsightRule }[]> {
    await this.loadRules(filePath);
    return Array.from(this.rules);
  }

  private async loadRules(filePath: string): Promise<void> {
    const config = this.configManager.getConfig();
    const configRules = config.rules ? Object.entries(config.rules) : [];

    this.rules.clear();

    const isTypescript = this.isTypeScriptFile(filePath);
    const isJavascript = this.isJavaScriptFile(filePath);
    const isPython = this.isPythonFile(filePath);

    configRules.forEach(([ruleName, ruleConfig]) => {
      const rule = this.createRule(
        ruleName,
        ruleConfig,
        isTypescript,
        isJavascript,
        isPython,
      );
      if (rule) {
        this.rules.add({ ruleName, rule });
      }
    });
  }

  private isTypeScriptFile(filePath: string): boolean {
    const extension = path.extname(filePath).toLowerCase();
    return extension === ".ts" || extension === ".tsx";
  }

  private isJavaScriptFile(filePath: string): boolean {
    const extension = path.extname(filePath).toLowerCase();
    return extension === ".js" || extension === ".jsx";
  }

  private isPythonFile(filePath: string): boolean {
    const extension = path.extname(filePath).toLowerCase();
    return extension === ".py";
  }

  private createRule(
    ruleName: string,
    ruleConfig: any,
    isTypescript: boolean,
    isJavascript: boolean,
    isPythonFile: boolean
  ): LabInsightRule | undefined {
    if (isTypescript && tsRules[ruleName]) {
      const RuleClass = tsRules[ruleName];
      return new RuleClass(ruleConfig);
    }
    if (isJavascript && jsRules[ruleName]) {
      const RuleClass = jsRules[ruleName];
      return new RuleClass(ruleConfig);
    }
    if (isPythonFile && pyRules[ruleName]) {
      const RuleClass = pyRules[ruleName];
      return new RuleClass(ruleConfig);
    }
    
    return undefined;
  }
}
