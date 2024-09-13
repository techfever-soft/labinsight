import { ArgManager } from "@core/managers/argManager";
import { DependencyReport } from "@interfaces/report.interface";
import { LoggerUtil } from "@utils/loggerUtil";
import chalk from "chalk";
import * as fs from "fs";
import fetch from "npm-registry-fetch";
import * as path from "path";

export class DependencyAnalyzer {
  private dependencyResults: DependencyReport = {
    dependencies: [],
    devDependencies: [],
  };

  /**
   * Gets the results of the dependency analysis
   * @returns DependencyReport
   */
  public getDependenciesReport(): DependencyReport {
    return this.dependencyResults;
  }

  /**
   * Analyzes the dependencies in the package.json file
   * @returns Promise<void>
   */
  public async analyze(): Promise<void> {
    try {
      const argManager = new ArgManager();
      const args = argManager.getArgs();

      const packageJsonPath = path.join(process.cwd(), "package.json");
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error("package.json not found in the current directory");
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};

      if (!args.silent) {
        const logger = new LoggerUtil();
        logger.spacing();
        console.log(`Using package.json: ${packageJson.name}`);
        logger.spacing();
      }

      const foundDependencies = await this.checkDependencyVersions(
        dependencies
      );
      const foundDevDependencies = await this.checkDependencyVersions(
        devDependencies
      );

      // Ensure results are correctly assigned
      this.dependencyResults.dependencies = foundDependencies;
      this.dependencyResults.devDependencies = foundDevDependencies;
    } catch (error) {
      console.error("An error occurred during the analysis:", error);
    }
  }

  /**
   * Fetches the latest version of a package from the npm registry
   * @param packageName string
   * @returns Promise<string>
   */
  private async getLatestVersion(packageName: string): Promise<string> {
    try {
      const response = await fetch.json(`/${packageName}`);
      return (response["dist-tags"] as any).latest;
    } catch (error) {
      console.error(`Error fetching version for ${packageName}:`, error);
      return "unknown";
    }
  }

  /**
   * Compares the current version with the latest version
   * @param currentVersion string
   * @param latestVersion string
   * @returns Promise<string>
   */
  private async compareVersions(
    currentVersion: string,
    latestVersion: string
  ): Promise<string> {
    const [currentMajor, currentMinor, currentPatch] = currentVersion
      .replace("^", "")
      .split(".")
      .map(Number);
    const [latestMajor, latestMinor, latestPatch] = latestVersion
      .split(".")
      .map(Number);

    if (
      currentMajor < latestMajor ||
      (currentMajor === latestMajor &&
        (currentMinor < latestMinor ||
          (currentMinor === latestMinor && currentPatch < latestPatch)))
    ) {
      return currentMajor < latestMajor ? "outdated" : "canUpdate";
    }
    return "upToDate";
  }

  /**
   * Checks the versions of the dependencies
   * @param dependencies { [key: string]: string }
   * @returns Promise<any[]>
   */
  private async checkDependencyVersions(dependencies: {
    [key: string]: string;
  }): Promise<any[]> {
    const results = await Promise.all(
      Object.entries(dependencies).map(async ([dep, version]) => {
        try {
          const latestVersion = await this.getLatestVersion(dep);
          const status = await this.compareVersions(version, latestVersion);

          const statusText = {
            canUpdate: {
              symbol: "⚠️",
              current: chalk.yellow(version),
              latest: chalk.green(latestVersion),
            },
            outdated: {
              symbol: "❌",
              current: chalk.red(version),
              latest: chalk.green(latestVersion),
            },
            upToDate: {
              symbol: "✅",
              current: chalk.green(version),
              latest: chalk.green(latestVersion),
            },
          }[status];

          console.log(
            `${statusText?.symbol} ${chalk.bold(dep)} => ${
              statusText?.current
            }${chalk.gray(" vs ")}${statusText?.latest}`
          );

          return {
            name: dep,
            currentVersion: version,
            latestVersion: latestVersion,
            status: status,
          };
        } catch (error) {
          console.error(`Error checking version for ${dep}:`, error);
          return {
            name: dep,
            currentVersion: version,
            latestVersion: "unknown",
            status: "error",
          };
        }
      })
    );

    return results;
  }
}
