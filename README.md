![](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/Frame%203.png?alt=media&token=a104bd9c-f7bd-45ee-83d0-5049b0d3cf4d)

A static code analysis tool designed to provide insights and improve the quality of your project's codebase.

![](https://img.shields.io/npm/v/@techfever/labinsight) ![](https://img.shields.io/npm/dt/@techfever/labinsight)

### [See the documentation](https://github.com/techfever-soft/labinsight/blob/main/docs)

### [See the changelog](https://github.com/techfever-soft/labinsight/blob/main/CHANGELOG.md)

## Features

Labinsight offers a comprehensive set of features to help you analyze and improve your codebase, whether you're working with JavaScript, TypeScript, or other languages. Here's what Labinsight can do:

### Project Analysis

- [x] **Project structure exploration**: Automatically detects and explores the structure of your project.
- [x] **Automatic project detection**: No need to configure paths manually; Labinsight intelligently detects your project setup.

### Reporting

- [x] **Terminal-based reports**: Real-time feedback and insights directly in the terminal.
- [x] **Command-line arguments**: Flexible CLI options for customized analysis (`--only <lang>`, `--silent`, etc.).
- [x] **JSON reports generation**: Detailed reports in JSON format for further processing.
- [ ] **Enhanced reporting formats**: Future support for HTML, XML, and online reports.

### Code Analysis

- [x] **Basic code analysis**: Identifies common errors and enforces best practices.

  - [x] **Casing rules**: Ensures consistent naming conventions.
    - [x] camelCase
    - [x] PascalCase
    - [x] snake_case
  - [x] **Options and configuration**: Customizable rules via the `.labinsight` configuration file.
  - [ ] **Decorators support**: Planned support for analyzing decorators.

- [x] **Deep code analysis**: Advanced analysis to identify complex code patterns.

  - [x] **Code complexity analysis**: Detects high complexity functions or classes that may need refactoring.
  - [ ] **Code performance analysis**: (Upcoming) Analyze performance bottlenecks in your code.

- [x] **Dependency checking**: Analyze dependencies to detect potential vulnerabilities or unused packages.

### Customization

- [x] **Custom rule creation**: Create your own rules to match your specific coding standards and needs.

### Multilanguage Support

- [x] **JavaScript and TypeScript**: Full support for JS/TS analysis.
- [x] **Python support**: New in v0.0.9, analyze Python code alongside JavaScript and TypeScript.

### CI/CD Integration

- [ ] **CI/CD pipelines**: Planned integration for automated code analysis in your CI/CD workflow.

### Upcoming Features

- [ ] **Support for additional languages**: Expand Labinsight to work with more programming languages.
- [ ] **Performance insights**: Advanced metrics and recommendations to optimize your codebase's performance.

[See the roadmap for more features](https://github.com/techfever-soft/labinsight/blob/main/ROADMAP.md)

## Supported Languages

![TypeScript](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/typescript-original%201.png?alt=media&token=037a43bd-ab27-42e3-b7cb-23ef2be578a4) ![JavaScript](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/javascript-original%201.png?alt=media&token=7ffecaaa-0b32-4f7a-92f8-413cdc674552) ![Python](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/python-original%201.png?alt=media&token=ce924af3-03b5-4b78-aa3b-ef9064e5f36c)

**More language support is planned in future releases.**

## Why choose LabInsight ?

Labinsight helps developers maintain high code quality by providing insights into their codebase during development. With powerful static analysis features, it ensures adherence to coding standards, helps reduce technical debt, and simplifies the task of identifying potential issues such as:

- **Overly complex functions**: Detect functions that exceed predefined complexity limits.
- **Missing documentation**: Highlight missing or incomplete documentation (JSDoc, etc.).
- **Non-standard naming conventions**: Ensure consistent naming conventions across variables, functions, classes, interfaces, enums, etc.
- **Inefficient loops**: Identify performance bottlenecks caused by inefficient loop structures.
- **Excessive file length**: Warns when files or functions exceed defined length limits.
- **Unused dependencies**: Spot and remove unused or unnecessary dependencies in your project.
- **Global state usage**: Detect the use of global state to avoid unexpected behavior.
- **Inline script usage**: Warns against using inline scripts in your codebase, promoting best security practices.
- **Deep code analysis**: Evaluate code complexity and cognitive load to maintain optimal code readability and maintainability.
- **Support for custom rules**: Easily add and apply custom rules tailored to your project's specific requirements.
- **Customizable reporting**: Generate detailed reports in JSON, HTML, XML, or other formats for better visibility into issues and insights.
- **Integration with CI/CD pipelines**: Seamlessly integrate LabInsight into your continuous integration and delivery pipelines.

And much more!

## Installation

To install Labinsight globally, use npm:

```bash
npm install -g @techfever/labinsight
```

## Usage

```bash
labinsight init
```

To initialize a new .labinsight file in your current working directory.
It automatically detects your project's configuration.

```bash
labinsight analyze
```

To analyze your codebase in a single command.
You will be prompted for which type of analysis you want to perform.

Available arguments are `--keep`, `--type`, `--silent`, `--verbose`, `--only`. [(See docs)](https://github.com/techfever-soft/labinsight/blob/main/docs/analyze.md)

## Contributing

We welcome contributions to Labinsight ! To contribute:

- Fork the repository.
- Create a new branch (git checkout -b feature/awesome-feature).
- Make your changes.
- Commit your changes (git commit -am 'Add awesome feature').
- Push to the branch (git push origin feature/awesome-feature).
- Open a pull request.
  Please ensure your pull request adheres to the code of conduct.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
