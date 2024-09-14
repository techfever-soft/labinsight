import { ConfigManager } from "@config/configManager";
import * as fs from "fs";
import * as path from "path";
import { LoggerUtil } from "@utils/loggerUtil";
import { LabInsightRule } from "@interfaces/rule.interface";
import chalk from "chalk";

export class CustomRuleLoader {
  /**
   * Loads the custom rules from the configuration file
   * @returns Promise<LabInsightRule[]>
   */
  public static async loadCustomRules(): Promise<LabInsightRule[]> {
    const logger = new LoggerUtil();
    const configManager = new ConfigManager();
    const config = configManager.getConfig();
    const customRules: LabInsightRule[] = [];

    if (config && config.customRules) {
      const customRulesConfig = Object.entries(config.customRules);

      // Load the custom rules
      for (const [ruleName, ruleConfig] of customRulesConfig) {
        try {
          const customRulePath = path.resolve(
            process.cwd(),
            (ruleConfig as any).path
          );

          // Check if the custom rule exists
          if (fs.existsSync(customRulePath)) {
            const RuleClass = await import(customRulePath).then(
              (module) => module.default
            );

            const ruleInstance = new RuleClass(ruleConfig);

            customRules.push(ruleInstance);
          } else {
            logger.log(
              "error",
              `Custom rule ${ruleName} not found at ${customRulePath}`
            );
          }
        } catch (error) {
          logger.log(
            "error",
            `Failed to load custom rule ${ruleName}: ${error}`
          );
        }
      }
    }

    return customRules;
  }
}
