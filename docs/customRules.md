![](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/Frame%203.png?alt=media&token=a104bd9c-f7bd-45ee-83d0-5049b0d3cf4d)

## Writing custom rules

Rules must be written in JavaScript and can be placed anywhere you want, because you must provide the path in the config.

You can use the template below :

```javascript
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
```

You must return a message, a severity (error, warning or off), and optionally a line and column number.

### Adding your rule

You can now add your custom rule to the `.labinsight` file :

```jsonc
{
  "$schema": "https://lab-insight.web.app/config.schema.json",
  "version": 2,
  // ...
  "customRules": {
    "js.whatever-rule": {
      "path": "./rules/customRule.js",
      "severity": "warning",
      "options": {
        "message": "console.log is not allowed ! (custom rule)"
        // ... Your own options
      }
    }
  },
  "rules": {
    // ...
  }
}
```
