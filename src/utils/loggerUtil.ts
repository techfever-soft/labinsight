import chalk from "chalk";

export class LoggerUtil {
  constructor() {}

  /**
   * Log a message with a specific level
   * @param level string
   * @param message string
   */
  public log(level: string, message: string) {
    switch (level) {
      case "info":
        console.log(chalk.blue(message));
        break;
      case "warning":
        console.log(chalk.yellow(message));
        break;
      case "error":
        console.log(chalk.red(message));
        break;
      default:
        console.log(message);
        break;
    }
  }

  /**
   * Get a line return with a tab before and a line length after
   * @param tabBefore number
   * @param lineLength number
   */
  public getLineReturn(tabBefore?: number, lineLength?: number) {
    const tab = " ".repeat(tabBefore || 2);
    const length = "─".repeat(lineLength || 1);
    return tab + "└" + length + " ";
  }

  /**
   * Log a spacing of a number of lines
   * @param count number
   */
  public spacing(count: number = 1) {
    for (let i = 0; i < count; i++) {
      console.log(" ");
    }
  }
}
