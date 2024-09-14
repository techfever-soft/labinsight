import { AstManager } from "@core/managers/astManager";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";

export class PyDirectoryAnalyzer {
  /**
   * Run the Python AST analysis script on a file
   * @param filePath string
   * @returns Promise<any>
   */
  private async runPythonAstAnalysis(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const tempOutputPath = path.join(__dirname, "../../../temp/ast.json");
      const scriptPath = path.join(__dirname, "../scripts/ast_parser.py");

      if (fs.existsSync(tempOutputPath)) {
        fs.unlinkSync(tempOutputPath);
      } else {
        fs.mkdirSync(path.dirname(tempOutputPath), { recursive: true });
      }

      execFile(
        "python3",
        [scriptPath, filePath, tempOutputPath],
        (error, stdout, stderr) => {
          if (error) {
            reject(`Erreur lors de l'exécution du script Python : ${stderr}`);
            return;
          }

          try {
            const result = fs.readFileSync(tempOutputPath, "utf8");
            resolve(JSON.parse(result));
          } catch (err) {
            reject(`Erreur lors de la lecture de l'AST : ${err}`);
          }
        }
      );
    });
  }

  /**
   * Return the AST of a Python file
   * @param filePath string
   * @returns Promise<any>
   */
  public async analyzePythonFile(filePath: string): Promise<any> {
    const ast = await this.runPythonAstAnalysis(filePath);

    const fileId = path.basename(filePath, ".py");
    const astPath = path.join(process.cwd(), `temp/ast-${fileId}.json`);

    if (fs.existsSync(astPath)) {
      fs.unlinkSync(astPath);
    } else {
      fs.mkdirSync(path.dirname(astPath), { recursive: true });
    }

    const astManager = new AstManager();

    astManager.flushASTs();

    astManager.storeAST(fileId, ast);

    fs.writeFileSync(astPath, JSON.stringify(ast, null, 2));

    return ast;
  }
}
