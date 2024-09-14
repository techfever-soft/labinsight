![](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/Frame%203.png?alt=media&token=a104bd9c-f7bd-45ee-83d0-5049b0d3cf4d)

## Analyzing your Codebase

The analyze command allows you to perform an in-depth analysis of your entire codebase with just a single command. Whether you're looking for basic code checks or advanced deep analysis, labinsight analyze covers it all.

Basic Usage
To analyze your project, run the following command:

```bash
labinsight analyze
```

This will trigger the default analysis, which checks your codebase and provides a report directly in your terminal. The default analysis includes common checks like code complexity, dependency usage, and rule violations. Future updates will support in-file reports.

Specifying the Type of Analysis
You can specify the type of analysis directly from the CLI to focus on certain aspects of your code. The available types are:

`full`: Complete analysis, covering all aspects of your codebase.
dependencies: Focused on analyzing and checking for issues with dependencies.

`dependencies`: Performs a dependencies analysis.

`basic`: Performs a quick, general check of common issues.

`deep`: Conducts an advanced, in-depth analysis, including performance and complexity checks.
To specify a type, use:

```bash
labinsight analyze -t <type>
```

or

```bash
labinsight analyze --type <type>
```

Example:

```bash
labinsight analyze --type full
```

### Keeping Previous Reports

By default, each time you run an analysis, the previous report is overwritten. If you'd like to retain previous reports for comparison or archival purposes, you can use the --keep option.

```bash
labinsight analyze -k
```

or

```bash
labinsight analyze --keep
```

This will ensure that the new report is appended, and previous reports are preserved.

### Filtering by Language

If your project contains multiple languages, you can use the --only option to limit the analysis to a specific language. This is particularly useful if you want to focus on one language at a time, such as JavaScript or Python.

```bash
labinsight analyze --only <language>
```

### Supported languages include:

`js` for JavaScript
`ts` for TypeScript
`py` for Python

Example:

```bash
labinsight analyze --only js
```

This command will restrict the analysis to JavaScript files only.

### Example: Combining Options

You can combine different options to tailor the analysis to your needs. For example, to perform a deep analysis on Python files while keeping previous reports, you can run:

```bash
labinsight analyze --type deep --only py --keep
```
