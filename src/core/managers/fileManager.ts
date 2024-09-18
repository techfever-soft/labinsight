import { ConfigManager } from "../../config/configManager";
import fs from "fs";
import path from "path";

export class FileManager {
  constructor() {}

  public getDirectoryFiles(directoryPath: string): string[] {
    let finalFiles: string[] = [];
    const files = fs.readdirSync(directoryPath);

    const configManager = new ConfigManager();
    const config = configManager.getConfig();

    const ignoredDirectories = config.ignoredDirectories;
    const ignoredFiles = config.ignoredFiles;

    for (const file of files) {
      if (ignoredDirectories.includes(file)) {
        continue;
      }

      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        finalFiles = finalFiles.concat(this.getDirectoryFiles(filePath));
      } else {
        if (ignoredFiles.includes(file)) {
          continue;
        }

        finalFiles.push(filePath);
      }
    }

    return finalFiles;
  }

  public async readFile(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, "utf-8");
  }
}
