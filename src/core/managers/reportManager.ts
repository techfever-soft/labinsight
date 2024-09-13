import path from "path";
import fs from "fs";
import { LabInsightArgType } from "@lab-types/arg.type";
import { ArgManager } from "./argManager";
import { LoggerUtil } from "@utils/loggerUtil";
import {
  BasicReport,
  DeepReport,
  DependencyReport,
} from "@interfaces/report.interface";
import chalk from "chalk";

export class ReportManager {
  private dependencyReportPath!: string;

  constructor() {}

  /**
   * Generate a report based on the type and format
   * @param type LabInsightArgType
   * @param format "json"
   * @param report any
   * @returns
   */
  public async generateReport(
    type: LabInsightArgType,
    format: "json",
    report: DeepReport | BasicReport | DependencyReport
  ) {
    switch (format) {
      case "json":
        this.generateJsonReport(type, report);
        break;
    }
  }

  /**
   * Generate a JSON report
   * @param type LabInsightArgType
   * @param report any
   */
  private async generateJsonReport(
    type: LabInsightArgType,
    report: DeepReport | BasicReport | DependencyReport
  ) {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/:/g, "-");
    const reportName = `${formattedDate}.json`;

    const reportsPath = path.join(process.cwd(), "reports");

    const configManager = new ArgManager();
    const args = configManager.getArgs();

    // Create the reports directory if it doesn't exist
    if (!fs.existsSync(reportsPath)) {
      fs.mkdirSync(reportsPath, { recursive: true });
    }

    let reportFolderPath: string;
    let reportFilePath: string;

    switch (type) {
      case "dependencies":
        reportFolderPath = path.join(reportsPath, "dependencies");
        break;
      case "basic":
        reportFolderPath = path.join(reportsPath, "basic");
        break;
      case "deep":
        reportFolderPath = path.join(reportsPath, "deep");
        break;
      case "full":
        reportFolderPath = path.join(reportsPath, "full");
        break;
      default:
        throw new Error("Invalid report type");
    }

    // Create the specific report folder if it doesn't exist
    if (!fs.existsSync(reportFolderPath)) {
      fs.mkdirSync(reportFolderPath);
    }

    // Check if args.keep is not set, then delete the existing reports in the folder
    if (!args.keep) {
      const files = fs.readdirSync(reportFolderPath);
      for (const file of files) {
        fs.unlinkSync(path.join(reportFolderPath, file));
      }
    }

    // Create the full path for the report file
    reportFilePath = path.join(reportFolderPath, reportName);

    // Write the report data to the file
    fs.writeFileSync(reportFilePath, JSON.stringify(report, null, 2));

    const logger = new LoggerUtil();

    logger.spacing();
    console.log(
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } report generated at ${chalk.italic(reportFilePath)}`
    );

    // If it's a dependencies report, store the path for reference
    if (type === "dependencies") {
      this.dependencyReportPath = reportFilePath;
    }
  }
}
