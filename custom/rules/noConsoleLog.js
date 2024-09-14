class NoConsoleLogRule {
    constructor(config) {
        this.severity = config.severity;
        this.options = config.options;
    }

    apply(fileContent, filePath) {
        const lines = fileContent.split("\n");

        const lineIndex = lines.findIndex((line) => line.includes("console.log"));

        if (lineIndex !== -1) {
            return {
                path: filePath,
                line: lineIndex + 1,
                column: 0,
                message: this.options.message,
                severity: this.severity,
            };
        }

        return null;
    }
}

module.exports = NoConsoleLogRule;