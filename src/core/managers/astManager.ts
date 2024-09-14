import fs from "fs";
import path from "path";

export class AstManager {
  private storedASTs: { [key: string]: any } = {};

  constructor() {}

  /**
   * Flushes the stored ASTs
   * @returns void
   */
  public flushASTs(): void {
    this.storedASTs = {};

    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const files = fs.readdirSync(tempDir);

    for (const file of files) {
      if (file.startsWith("ast")) {
        fs.unlinkSync(path.join(tempDir, file));
      }
    }
  }

  public getTempASTs(): { [key: string]: any } {
    return this.storedASTs;
  }

  public getStoredAST(key: string): any {
    return this.storedASTs[key];
  }

  public getFileAST(fileId: string): any {
    const file = fs.readFileSync(
      path.join(process.cwd(), `temp/ast-${fileId}.json`),
      "utf8"
    );

    return JSON.parse(file);
  }

  public storeAST(key: string, ast: any): void {
    this.storedASTs[key] = ast;
  }
}
