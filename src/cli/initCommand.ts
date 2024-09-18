import { ConfigManager } from "../config/configManager";

export class InitCommand {
  /**
   * Executes the init command
   * Initializes the configuration file
   * @returns void
   */
  public execute(): void {
    const configManager = new ConfigManager();
    configManager.initializeConfig();
  }
}
