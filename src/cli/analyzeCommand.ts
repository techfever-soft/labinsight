import { ConfigManager } from "@config/configManager";
import { ReportFactory } from "@core/factories/reportFactory";
import { ComplexityLogger } from "@core/loggers/complexityLogger";
import { ArgManager } from "@core/managers/argManager";
import { ReportManager } from "@core/managers/reportManager";
import { select } from "@inquirer/prompts";
import { LabInsightArgType } from "@lab-types/arg.type";
import { ReportFormat } from "@lab-types/report.type";
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
    let outputFormat: string = args.format as ReportFormat;

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
    if (!outputFormat) {
      outputFormat = await select({
        message: "Select the output format for the analysis",
        choices: [
          {
            name: "JSON",
            value: "json",
            description: "Generates a JSON report",
          },
          {
            name: "HTML",
            value: "html",
            description: "Generates an HTML report",
          },
          {
            name: "CSV",
            value: "csv",
            description: "Generates a CSV report",
            disabled: true,
          },
          {
            name: "XML",
            value: "xml",
            description: "Generates an XML report",
            disabled: true,
          },
        ],
      });
    }

    const format = outputFormat as ReportFormat;

    await this.startAnalysis(analysisType, format);
  }

  /**
   * Initiates the selected type of analysis.
   * @param type LabInsightArgType
   */
  private async startAnalysis(
    type: LabInsightArgType,
    outputFormat: ReportFormat
  ): Promise<void> {
    switch (type) {
      case "full":
        await this.performFullAnalysis(outputFormat);
        break;
      case "dependencies":
        await this.startDependencyAnalysis(outputFormat);
        break;
      case "basic":
        await this.startBasicAnalysis(outputFormat);
        break;
      case "deep":
        await this.startDeepAnalysis(outputFormat);
        break;
      default:
        console.error("Invalid analysis type, please select a valid type");
        process.exit(1);
    }
  }

  private async startDependencyAnalysis(format: ReportFormat): Promise<void> {
    try {
      const reportFactory = new ReportFactory();
      await reportFactory.buildReport("dependencies");

      const dependencyReport = reportFactory.getDependencyReport();

      const reportManager = new ReportManager();
      reportManager.generateReport("dependencies", format, dependencyReport);

      const logger = new LoggerUtil();

      logger.spacing();

      console.log(chalk.blue("Enjoying LabInsight ? We value your feedback !"));
      console.log(
        chalk.blue("Please leave a review here: ") +
          chalk.underline("https://forms.gle/uEKij6RwHaucdpQ8A")
      );
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
  private async startBasicAnalysis(format: ReportFormat): Promise<void> {
    try {
      const reportFactory = new ReportFactory();
      await reportFactory.buildReport("basic");

      const basicReport = reportFactory.getBasicReport();

      const reportManager = new ReportManager();
      reportManager.generateReport("basic", format, basicReport);

      const logger = new LoggerUtil();

      logger.spacing();

      console.log(chalk.blue("Enjoying LabInsight ? We value your feedback !"));
      console.log(
        chalk.blue("Please leave a review here: ") +
          chalk.underline("https://forms.gle/uEKij6RwHaucdpQ8A")
      );
    } catch (error) {
      console.error("An error occurred while performing basic analysis", error);
    }
  }

  /**
   * Starts the deep analysis.
   */
  private async startDeepAnalysis(format: ReportFormat): Promise<void> {
    try {
      const reportFactory = new ReportFactory();
      await reportFactory.buildReport("deep");

      const deepReport = reportFactory.getDeepReport();

      const complexityLogger = new ComplexityLogger();
      complexityLogger.logCodeComplexityResult(deepReport.complexity);

      const reportManager = new ReportManager();
      reportManager.generateReport("deep", format, deepReport);

      const logger = new LoggerUtil();

      logger.spacing();

      console.log(chalk.blue("Enjoying LabInsight ? We value your feedback !"));
      console.log(
        chalk.blue("Please leave a review here: ") +
          chalk.underline("https://forms.gle/uEKij6RwHaucdpQ8A")
      );
    } catch (error) {
      console.error("An error occurred while performing deep analysis", error);
    }
  }

  /**
   * Performs a full analysis (dependencies + basic + deep).
   */
  private async performFullAnalysis(format: ReportFormat): Promise<void> {
    const logger = new LoggerUtil();
    const reportsFolder = path.join(process.cwd(), "reports");

    try {
      await this.startDependencyAnalysis(format);
      await this.startBasicAnalysis(format);
      await this.startDeepAnalysis(format);

      logger.spacing();

      console.log(chalk.greenBright("Full analysis completed successfully 🚀"));
      console.log(
        chalk.greenBright(
          `Reports are available in ${chalk.bold(reportsFolder)}`
        )
      );

      logger.spacing();

      console.log(chalk.blue("Enjoying LabInsight ? We value your feedback !"));
      console.log(
        chalk.blue("Please leave a review here: ") +
          chalk.underline("https://forms.gle/uEKij6RwHaucdpQ8A")
      );
    } catch (error) {
      console.error("An error occurred while performing full analysis", error);
    }
  }
}
