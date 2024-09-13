class NoBlankSpaceRule {
  constructor(options) {
    this.ruleName = "custom.no-blank-space";
    this.severity = options.severity || "warning";
    this.message = options.message || "Unnecessary blank space detected";
  }

  /**
   * Applique la règle sur le contenu du fichier
   * @param {string} fileContent - Le contenu du fichier à analyser
   * @param {string} filePath - Le chemin du fichier à analyser
   * @returns {object|null} - Retourne un résultat s'il y a une violation
   */
  apply(fileContent, filePath) {
    const lines = fileContent.split("\n");
    let results = [];

    lines.forEach((line, index) => {
      if (line.trim() === "") {
        results.push({
          line: index + 1,
          column: 0,
          message: this.message,
          severity: this.severity,
          path: filePath,
        });
      }
    });

    return results.length > 0 ? results : null;
  }
}

module.exports = NoBlankSpaceRule;
