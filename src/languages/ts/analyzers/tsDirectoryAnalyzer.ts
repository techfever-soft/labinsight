import { FileManager } from "../../../core/managers/fileManager";
import {
  IDirectoryAnalyzer,
  IAnalyzer,
  CodeComplexityResult,
} from "../../../interfaces/analyzer.interface";

export class TSDirectoryAnalyzer implements IDirectoryAnalyzer {
  private fileAnalyzer: IAnalyzer;
  private fileManager: FileManager;

  constructor(fileAnalyzer: IAnalyzer) {
    this.fileAnalyzer = fileAnalyzer;
    this.fileManager = new FileManager();
  }

  public async analyzeDirectory(
    directoryPath: string,
    analysisType: "basic" | "complexity"
  ): Promise<void> {
    const files = this.fileManager.getDirectoryFiles(directoryPath);
    const tsFiles = files.filter((file) => file.endsWith(".ts"));

    for (const filePath of tsFiles) {
      const fileContent = await this.fileManager.readFile(filePath);
      await this.fileAnalyzer.analyze(fileContent, filePath);
    }
  }

  public async analyzeCodeComplexity(
    directoryPath: string
  ): Promise<CodeComplexityResult> {
    const files = this.fileManager.getDirectoryFiles(directoryPath);
    const tsFiles = files.filter((file) => file.endsWith(".ts"));

    let totalComplexity = 0;
    let totalCognitiveComplexity = 0;
    let fileCount = 0;
    let lineCount = 0;
    let maxComplexity = 0;
    let maxCognitiveComplexity = 0;

    for (const filePath of tsFiles) {
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
