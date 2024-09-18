import path from "path";
import fs from "fs";
import { confirm } from "@inquirer/prompts";
import { LabInsightConfig } from "../interfaces/config.interface";
import { AutoDetectManager } from "./autoDetectManager";

export class ConfigManager {
  constructor() {}

  /**
   * Gets the loaded configuration
   * @returns LabInsightConfig
   */
  public getConfig(): LabInsightConfig {
    return this.loadConfig();
  }

  /**
   * Initializes the configuration file
   * @returns void
   */
  public async initializeConfig() {
    const cwd = process.cwd();
    const autoDetect = new AutoDetectManager(cwd);
    const newConfig = autoDetect.detectProjectConfig();

    const configPath = path.join(cwd, ".labinsight");

    if (fs.existsSync(configPath)) {
      const overwrite = await confirm({
        message: "Configuration file already exists. Overwrite ?",
        default: false,
      });

      if (!overwrite) {
        return;
      } else {
        fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
        console.log(`Configuration file created at ${configPath}`);
      }
    } else {
      fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
      console.log(`Configuration file created at ${configPath}`);
    }
  }

  /**
   * Loads the configuration file
   * @returns LabInsightConfig
   */
  private loadConfig(): any {
    const cwd = process.cwd();
    const configPath = path.join(cwd, ".labinsight");

    if (!fs.existsSync(configPath)) {
      this.initializeConfig();
    }

    const configFile = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(configFile) as any;

    if (!config.rules) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }

    return config;
  }
}
