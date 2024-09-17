![](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/banner.png?alt=media&token=a445c85e-498b-42eb-8a4a-4a3f137d796f)

LabInsight is a powerful static code analysis tool that provides deep insights into your codebase.

Whether you're working with JavaScript, TypeScript, or Python, LabInsight helps you identify potential code issues, enforce best practices, and maintain a high level of code quality.

![](https://img.shields.io/npm/v/@techfever/labinsight) ![](https://img.shields.io/npm/dt/@techfever/labinsight) ![](https://img.shields.io/github/issues/techfever-soft/labinsight)

### [See the documentation](https://github.com/techfever-soft/labinsight/blob/main/docs)

### [Review the tool](https://forms.gle/xLBZHFiqwAQUStiz9)

### [See the changelog](https://github.com/techfever-soft/labinsight/blob/main/CHANGELOG.md)

## 🚀 Get Started with LabInsight

Improve your development workflow with customizable rules, in-depth analysis, and real-time reports — all from the comfort of your terminal.

## 🔍 Key Features

- **Project Exploration**: Automatically analyzes your project's structure without needing to configure paths manually.
- **Multi-language Support**: Supports JavaScript, TypeScript, and Python, with more languages planned.
- **Flexible Reporting**: Generate terminal, JSON, or HTML reports to track and share code quality.
- **Real-time Feedback**: Catch errors as you code, improving productivity and preventing future issues.

### Code Analysis and Customization

LabInsight offers both basic and deep code analysis:

- **Basic Analysis**: Quickly identifies common errors and ensures best practices.
- **Deep Analysis**: Examines code complexity, cognitive complexity, and other advanced metrics to optimize your code.
- **Custom Rules**: Tailor LabInsight to your project by creating custom rules to enforce your specific standards.

[See the roadmap for more features](https://github.com/techfever-soft/labinsight/blob/main/ROADMAP.md)

## 📊 Supported Languages

![TypeScript](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/typescript-original%201.png?alt=media&token=037a43bd-ab27-42e3-b7cb-23ef2be578a4) ![JavaScript](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/javascript-original%201.png?alt=media&token=7ffecaaa-0b32-4f7a-92f8-413cdc674552) ![Python](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/python-original%201.png?alt=media&token=ce924af3-03b5-4b78-aa3b-ef9064e5f36c)

**More language support is planned in future releases.**

## 🔧 Features in Development

LabInsight is constantly evolving! Here are some of the exciting features we’re working on:

- Support for more languages (Go, Ruby, etc.)
- Performance Analysis to identify bottlenecks.
- CI/CD Pipeline Integration for automated code checks.

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

Available arguments are `--keep`, `--type`, `--silent`, `--verbose`, `--only`, `--format`. [(See docs)](https://github.com/techfever-soft/labinsight/blob/main/docs/analyze.md)

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
