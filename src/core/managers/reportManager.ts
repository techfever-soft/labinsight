import path from "path";
import fs from "fs";
import { LabInsightArgType } from "../../types/arg.type";
import { ArgManager } from "./argManager";
import { LoggerUtil } from "../../utils/loggerUtil";
import {
  BasicReport,
  DeepReport,
  DependencyReport,
} from "../../interfaces/report.interface";
import chalk from "chalk";
import { ReportFormat } from "../../types/report.type";
import Handlebars, { log } from "handlebars";
import { v4 as uuid } from "uuid";
import { exec } from "child_process";

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
    format: ReportFormat,
    report: DeepReport | BasicReport | DependencyReport
  ) {
    switch (format) {
      case "json":
        this.generateJsonReport(type, report);
        break;
      case "html":
        this.generateHtmlReport(type, report);
        break;
      default:
        throw new Error("Invalid report format");
    }
  }

  private async generateHtmlReport(
    type: LabInsightArgType,
    report: DeepReport | BasicReport | DependencyReport
  ) {
    const now = new Date();
    const id = uuid();
    const reportName = `${id}.html`;
    const reportsPath = path.join(process.cwd(), "reports", type, "html");

    const templatePath = path.join(
      __dirname,
      "..",
      "..",
      "templates",
      "report.hbs"
    );
    const template = fs.readFileSync(templatePath, "utf8");

    Handlebars.registerHelper("eq", function (a, b) {
      return a === b;
    });

    const compiledTemplate = Handlebars.compile(template);

    const typeFormatted = type.charAt(0).toUpperCase() + type.slice(1);

    const finalReport = {
      ...report,
      reportId: id,
      reportType: typeFormatted,
      reportDate: now.toLocaleString(),
    };

    const htmlOutput = compiledTemplate(finalReport);

    if (!fs.existsSync(reportsPath)) {
      fs.mkdirSync(reportsPath, { recursive: true });
    }

    const reportFilePath = path.join(reportsPath, reportName);
    fs.writeFileSync(reportFilePath, htmlOutput);

    const logger = new LoggerUtil();

    logger.spacing();

    console.log(
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } report generated at ${chalk.italic(reportFilePath)}`
    );

    // Try to open the report in the browser
    try {
      const startCommand = process.platform === "win32" ? "start" : "open";
      exec(`${startCommand} ${reportFilePath}`);
    } catch (e) {
      console.log("Failed to open the report in the browser");
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
    const id = uuid();
    const now = new Date();
    const formattedDate = now.toISOString().replace(/:/g, "-");
    const reportName = `${id}.json`;
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
        const filePath = path.join(reportFolderPath, file);
        const fileStat = fs.lstatSync(filePath);

        // Only unlink files, not directories
        if (fileStat.isFile()) {
          fs.unlinkSync(filePath);
        } else if (fileStat.isDirectory()) {
          // If it's a directory, you can remove it recursively if needed
          fs.rmdirSync(filePath, { recursive: true });
        }
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
