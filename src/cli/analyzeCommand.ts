import { ConfigManager } from "@config/configManager";
import { BasicAnalyzer } from "@core/analyzers/basicAnalyzer";
import { DeepAnalyzer } from "@core/analyzers/deepAnalyzer";
import { ReportFactory } from "@core/factories/reportFactory";
import { ComplexityLogger } from "@core/loggers/complexityLogger";
import { ArgManager } from "@core/managers/argManager";
import { ReportManager } from "@core/managers/reportManager";
import { select } from "@inquirer/prompts";
import { LabInsightArgType } from "@lab-types/arg.type";
import { LoggerUtil } from "@utils/loggerUtil";
import chalk from "chalk";
import path from "path";

export class AnalyzeCommand {
  private verbose: boolean = false;

  /**
   * Executes the analyze command.
   * Initializes and performs the requested analysis.
   * @returns void
   */
  public async execute(options: any): Promise<void> {
    const configManager = new ConfigManager();
    const argManager = new ArgManager();

    if (!configManager.getConfig()) {
      await configManager.initializeConfig();
    }

    const storeArgs = (args: any) => {
      argManager.flushArgs();

      const optionsMap = Object.entries(options).map(([key, value]) => ({
        key,
        value,
      }));

      optionsMap.forEach((option) => {
        argManager.storeArg(option.key, option.value as string);

        // Apply verbose mode
        if (option.key === "verbose") {
          this.verbose = true;
        }
        // If verbose mode is enabled, log the options set
        if (this.verbose) {
          const logger = new LoggerUtil();
          logger.log("warning", `${option.key} is set to ${option.value}`);
        }
      });
    };

    // Flush and store the new args
    storeArgs(options);

    // Get the stored args as a map
    const args = argManager.getArgs();
    let analysisType: LabInsightArgType = args.type as LabInsightArgType;

    if (!analysisType) {
      analysisType = await select({
        message: "Select the type of analysis you want to perform",
        choices: [
          {
            name: "Full (dependencies + basic + deep analysis)",
            value: "full",
            description: "Performs dependencies, basic, and deep analysis",
          },
          {
            name: "Dependencies only",
            value: "dependencies",
            description: "Analyzes the dependencies of the files",
          },
          {
            name: "Basic only",
            value: "basic",
            description: "Surface-level analysis of the files",
          },
          {
            name: "Deep only",
            value: "deep",
            description: "Performs a deep analysis of the files",
          },
        ],
      });
    }

    await this.startAnalysis(analysisType);
  }

  /**
   * Initiates the selected type of analysis.
   * @param type LabInsightArgType
   */
  private async startAnalysis(type: LabInsightArgType): Promise<void> {
    switch (type) {
      case "full":
        await this.performFullAnalysis();
        break;
      case "dependencies":
        await this.startDependencyAnalysis();
        break;
      case "basic":
        await this.startBasicAnalysis();
        break;
      case "deep":
        await this.startDeepAnalysis();
        break;
      default:
        console.error("Invalid analysis type, please select a valid type");
        process.exit(1);
    }
  }

  private async startDependencyAnalysis(): Promise<void> {
    try {
      const reportFactory = new ReportFactory();
      await reportFactory.buildReport("dependencies");

      const dependencyReport = reportFactory.getDependencyReport();

      const reportManager = new ReportManager();
      reportManager.generateReport("dependencies", "json", dependencyReport);
    } catch (error) {
      console.error(
        "An error occurred while performing dependency analysis",
        error
      );
    }
  }

  /**
   * Starts the basic analysis.
   */
  private async startBasicAnalysis(): Promise<void> {
    try {
      const reportFactory = new ReportFactory();
      await reportFactory.buildReport("basic");

      const basicReport = reportFactory.getBasicReport();

      const reportManager = new ReportManager();
      reportManager.generateReport("basic", "json", basicReport);
    } catch (error) {
      console.error("An error occurred while performing basic analysis", error);
    }
  }

  /**
   * Starts the deep analysis.
   */
  private async startDeepAnalysis(): Promise<void> {
    try {
      const reportFactory = new ReportFactory();
      await reportFactory.buildReport("deep");

      const deepReport = reportFactory.getDeepReport();

      const complexityLogger = new ComplexityLogger();
      complexityLogger.logCodeComplexityResult(deepReport.complexity);

      const reportManager = new ReportManager();
      reportManager.generateReport("deep", "json", deepReport);
    } catch (error) {
      console.error("An error occurred while performing deep analysis", error);
    }
  }

  /**
   * Performs a full analysis (dependencies + basic + deep).
   */
  private async performFullAnalysis(): Promise<void> {
    const logger = new LoggerUtil();
    const reportsFolder = path.join(process.cwd(), "reports");

    try {
      await this.startDependencyAnalysis();
      await this.startBasicAnalysis();
      await this.startDeepAnalysis();

      logger.spacing();

      console.log(chalk.greenBright("Full analysis completed successfully 🚀"));
      console.log(
        chalk.greenBright(
          `Reports are available in ${chalk.bold(reportsFolder)}`
        )
      );
    } catch (error) {
      console.error("An error occurred while performing full analysis", error);
    }
  }
}
