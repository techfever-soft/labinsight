import fs from "fs";
import path from "path";

export class ArgManager {
  private args: { [key: string]: string } = {};

  constructor() {}

  /**
   * Flushes the stored arguments
   * @returns void
   */
  public flushArgs(): void {
    const tempFile = path.join(process.cwd(), "temp", "args.json");
    if (!fs.existsSync(tempFile)) {
      fs.mkdirSync(path.join(process.cwd(), "temp"));
      fs.writeFileSync(tempFile, "{}");
    } else {
      fs.writeFileSync(tempFile, "{}");
    }
  }

  /**
   * Stores an argument
   * @param key string
   * @param value string
   * @returns void
   */
  public storeArg(key: string, value: string): void {
    this.args[key] = value;

    const tempFile = path.join(process.cwd(), "temp", "args.json");

    if (!fs.existsSync(path.join(process.cwd(), "temp"))) {
      fs.mkdirSync(path.join(process.cwd(), "temp"));
      fs.writeFileSync(tempFile, JSON.stringify(this.args, null, 2));
    } else {
      fs.writeFileSync(tempFile, JSON.stringify(this.args, null, 2));
    }
  }

  /**
   * Gets the stored arguments
   * @returns { [key: string]: string }
   */
  public getArgs(): { [key: string]: string } {
    const tempFile = path.join(process.cwd(), "temp", "args.json");
    const args = fs.readFileSync(tempFile, "utf-8");
    return JSON.parse(args);
  }
}
