/**
 * Interface for analyzers
 */
export interface IAnalyzer {
  analyze(fileContent: string, filePath: string): Promise<AnalysisResult>;
}

/**
 * Interface for analysis results
 */
export interface AnalysisResult {
  complexity: number;
  cognitiveComplexity: number;
  maxPossibleCognitiveComplexity: number;
  maxPossibleComplexity: number;
  loc: number;
  path: string;
}

/**
 * Interface for directory analyzers
 */
export interface IDirectoryAnalyzer {
  analyzeDirectory(
    directoryPath: string,
    analysisType: "basic" | "complexity"
  ): Promise<void>;
  analyzeCodeComplexity(directoryPath: string): Promise<CodeComplexityResult>;
}

/**
 * Interface for code complexity results
 */
export interface CodeComplexityResult {
  totalComplexity: number;
  totalCognitiveComplexity: number;
  fileCount: number;
  lineCount: number;
  maxComplexity: number;
  maxCognitiveComplexity: number;
  maxPossibleComplexity: number;
  maxPossibleCognitiveComplexity: number;
}
