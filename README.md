![](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/Frame%203.png?alt=media&token=a104bd9c-f7bd-45ee-83d0-5049b0d3cf4d)

A static code analysis tool designed to provide insights and improve the quality of your project's codebase.

![](https://img.shields.io/npm/v/@techfever/labinsight) ![](https://img.shields.io/npm/dt/@techfever/labinsight)

### [See the documentation](https://github.com/techfever-soft/labinsight/blob/main/docs)

### [See the changelog](https://github.com/techfever-soft/labinsight/blob/main/CHANGELOG.md)

## Features

- [x] Project structure exploration
- [x] Terminal-based reports
- [x] Automatic project detection
- [x] Custom configuration file '.labinsight' (v2)
- [x] Basic code analysis for common errors
  - [x] Options
  - [ ] Decorators
  - [x] Casing
    - [x] camelCase
    - [x] PascalCase
    - [x] snake_case
- [x] Deep code analysis
  - [x] Code complexity analysis
  - [ ] Code performance analysis
- [x] Dependency checking
- [x] Custom rule creation
- [x] Command line arguments
- [x] JSON reports generation

Upcoming features and improvements include:

- [ ] Support for Python and other languages
- [ ] Enhanced reporting formats (Online, JSON, HTML, XML)
- [ ] Integration with CI/CD pipelines

[See the roadmap for more features](https://github.com/techfever-soft/labinsight/blob/main/ROADMAP.md)

## Supported Languages

![TypeScript](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/typescript-original%201.png?alt=media&token=037a43bd-ab27-42e3-b7cb-23ef2be578a4) ![JavaScript](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/javascript-original%201.png?alt=media&token=7ffecaaa-0b32-4f7a-92f8-413cdc674552)

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

Available arguments are `--keep`, `--type`, `--silent`. [(See docs)](https://github.com/techfever-soft/labinsight/blob/main/docs/analyze.md)

```bash
labinsight generate-rule
```

To generate a new rule file. [(See docs)](https://github.com/techfever-soft/labinsight/blob/main/docs/customRules.md)

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
