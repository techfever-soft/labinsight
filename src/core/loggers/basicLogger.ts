import { LabInsightRuleResponse } from "@interfaces/rule.interface";
import { LoggerUtil } from "@utils/loggerUtil";

export class BasicLogger {
  /**
   * Logs the result of the analysis
   * @param ruleName string
   * @param rule any
   * @param result LabInsightRuleResponse | LabInsightRuleResponse[]
   */
  public logResult(
    ruleName: string,
    rule: any,
    result: LabInsightRuleResponse | LabInsightRuleResponse[]
  ): void {
    if (Array.isArray(result)) {
      for (const res of result) {
        this.logMessage(ruleName, rule, res);
      }
    } else {
      this.logMessage(ruleName, rule, result);
    }
  }

  /**
   * Logs the message of the result
   * @param ruleName string
   * @param rule any
   * @param result LabInsightRuleResponse
   */
  public logMessage(
    ruleName: string,
    rule: any,
    result: LabInsightRuleResponse
  ): void {
    const logger = new LoggerUtil();
    const severity = rule.options ? rule.options.severity : rule.severity;

    logger.log(
      severity,
      logger.getLineReturn() + `[${ruleName}] ${result.message}`
    );
    logger.log(
      "info",
      logger.getLineReturn(5) +
        `at ${result.path}:${result.line}${
          result.column ? `:${result.column}` : ""
        }`
    );
  }
}
