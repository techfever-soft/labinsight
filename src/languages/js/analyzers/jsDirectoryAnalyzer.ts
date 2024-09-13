import { ConfigManager } from "@config/configManager";
import { FileManager } from "@core/managers/fileManager";
import {
  IDirectoryAnalyzer,
  IAnalyzer,
  CodeComplexityResult,
} from "@interfaces/analyzer.interface";

export class JSDirectoryAnalyzer implements IDirectoryAnalyzer {
  private fileAnalyzer: IAnalyzer;
  private fileManager: FileManager;
  private ignoredDirectories: string[];

  constructor(fileAnalyzer: IAnalyzer) {
    this.fileAnalyzer = fileAnalyzer;
    this.fileManager = new FileManager();
    const configManager = new ConfigManager();
    this.ignoredDirectories = configManager.getConfig().ignoredDirectories;
  }

  public async analyzeDirectory(
    directoryPath: string,
    analysisType: "basic" | "complexity"
  ): Promise<void> {
    const files = this.fileManager.getDirectoryFiles(directoryPath);
    const jsFiles = files.filter((file) => file.endsWith(".js"));

    for (const filePath of jsFiles) {
      const fileContent = await this.fileManager.readFile(filePath);
      await this.fileAnalyzer.analyze(fileContent, filePath);
    }
  }

  public async analyzeCodeComplexity(
    directoryPath: string
  ): Promise<CodeComplexityResult> {
    const files = this.fileManager.getDirectoryFiles(directoryPath);
    const jsFiles = files.filter((file) => file.endsWith(".js"));

    let totalComplexity = 0;
    let totalCognitiveComplexity = 0;
    let fileCount = 0;
    let lineCount = 0;
    let maxComplexity = 0;
    let maxCognitiveComplexity = 0;

    for (const filePath of jsFiles) {
      const fileContent = await this.fileManager.readFile(filePath);
      const { complexity, cognitiveComplexity, loc } =
        await this.fileAnalyzer.analyze(fileContent, filePath);

      lineCount += loc;
      totalComplexity += complexity;
      totalCognitiveComplexity += cognitiveComplexity;
      fileCount++;

      if (complexity > maxComplexity) {
        maxComplexity = complexity;
      }
      if (cognitiveComplexity > maxCognitiveComplexity) {
        maxCognitiveComplexity = cognitiveComplexity;
      }
    }

    const maxPossibleComplexity = maxComplexity * fileCount;
    const maxPossibleCognitiveComplexity = maxCognitiveComplexity * fileCount;

    return {
      totalComplexity,
      totalCognitiveComplexity,
      fileCount,
      lineCount,
      maxComplexity,
      maxCognitiveComplexity,
      maxPossibleComplexity,
      maxPossibleCognitiveComplexity,
    };
  }
}
