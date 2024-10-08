import { CodeComplexityResult, AnalysisResult } from "../../interfaces/analyzer.interface";
import { AnalyzerFactory } from "../factories/analyzerFactory";
import { ComplexityLogger } from "../loggers/complexityLogger";
import { ArgManager } from "../managers/argManager";
import { FileManager } from "../managers/fileManager";


export class DeepAnalyzer {
  private fileManager = new FileManager();
  private codeComplexityResult!: CodeComplexityResult;
  private filesResult: Set<AnalysisResult> = new Set();

  /**
   * Gets the code complexity result
   * @returns Promise<CodeComplexityResult>&
   */
  public async getCodeComplexityResult(): Promise<CodeComplexityResult> {
    return this.codeComplexityResult;
  }

  /**
   * Gets the results of the analysis
   * @returns Promise<Set<AnalysisResult>>
   */
  public async getFilesResult(): Promise<Set<AnalysisResult>> {
    return this.filesResult;
  }

  /**
   * Analyzes the files in the current directory
   * @returns Promise<void>
   */
  public async analyze(): Promise<void> {
    const files = this.fileManager.getDirectoryFiles(process.cwd());

    for (const file of files) {
      const argManager = new ArgManager();
      const onlyLanguage = argManager.getArgs().only;

      if (onlyLanguage) {
        if (!file.endsWith("." + onlyLanguage)) {
          continue;
        }
      }

      await this.analyzeFile(file);
    }
  }

  /**
   * Analyzes a file
   * @param file string
   */
  private async analyzeFile(file: string): Promise<void> {
    try {
      const fileContent = await this.fileManager.readFile(file);
      const analyzer = AnalyzerFactory.getAnalyzer(file);

      console.log(`📄 Analyzing file ${file}`);

      if (analyzer) {
        const result = await analyzer.analyze(fileContent, file);

        const fileAnalysisResult = { ...result, path: file };
        this.filesResult.add(fileAnalysisResult);

        const logger = new ComplexityLogger();
        logger.logAnalysisResults(result);
      } else {
        console.log(`No analyzer available for ${file}`);
      }
    } catch (error) {
      console.error(`Error analyzing file ${file}:`, error);
    }
  }

  /**
   * Calculates the code complexity result
   * @returns Promise<CodeComplexityResult>
   */
  public async calculateCodeComplexityResult(): Promise<CodeComplexityResult> {
    const files = this.fileManager.getDirectoryFiles(process.cwd());
    let totalComplexity = 0;
    let totalCognitiveComplexity = 0;
    let fileCount = 0;
    let lineCount = 0;
    let maxComplexity = 0;
    let maxCognitiveComplexity = 0;
    let maxPossibleComplexity = 0;
    let maxPossibleCognitiveComplexity = 0;

    for (const file of files) {
      const fileContent = await this.fileManager.readFile(file);
      const analyzer = AnalyzerFactory.getAnalyzer(file);

      if (analyzer) {
        const result = await analyzer.analyze(fileContent, file);
        lineCount += result.loc;
        totalComplexity += result.complexity;
        totalCognitiveComplexity += result.cognitiveComplexity;
        fileCount++;

        maxComplexity = Math.max(maxComplexity, result.complexity);
        maxCognitiveComplexity = Math.max(
          maxCognitiveComplexity,
          result.cognitiveComplexity
        );
        maxPossibleComplexity += 10; // Ajustement à faire en fonction des spécifications
        maxPossibleCognitiveComplexity += 15; // Ajustement à faire en fonction des spécifications
      }
    }

    const result: CodeComplexityResult = {
      totalComplexity,
      totalCognitiveComplexity,
      fileCount,
      lineCount,
      maxComplexity,
      maxCognitiveComplexity,
      maxPossibleComplexity,
      maxPossibleCognitiveComplexity,
    };

    this.codeComplexityResult = result;

    return result;
  }
}
