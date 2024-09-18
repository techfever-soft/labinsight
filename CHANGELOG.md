![](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/Frame%203.png?alt=media&token=a104bd9c-f7bd-45ee-83d0-5049b0d3cf4d)

## Version 0.1.4 - 2024-09-18

### Changed

- **Aliases**: Updated module aliases in `package.json` from `dist/src/...` to `dist/...` to ensure compatibility with the VSCode extension and proper resolution of paths.

## Version 0.1.3 - 2024-09-18

### Changed

- **Dependencies**: Moved all `devDependencies` to `dependencies` to ensure that necessary packages, such as `@techfever/labinsight` and `@inquirer/prompts`, are included in the final bundle of the VSCode extension. This modification prevents errors related to missing modules during the execution of the extension.

### Fixed

- **Bundling Issue**: Resolved the problem where the `node_modules` folder was not included in the extension package, preventing the correct execution of CLI scripts.

## Version 0.1.2 - 2024-09-18

### Improvements

- **Directory Structure**: Changed the `srcDir` in `tsconfig.json` to `./src`, setting `index.ts` as the new entry point. This update standardizes the project layout, making it easier to manage and scale.
- **Module Resolution**: Ensured that all source files are correctly referenced, reducing build errors and improving the reliability of the compilation process.

## Version 0.1.1 - 2024-09-17

## New Features

- **Python Deep Analyzer**: Implemented the Python deep analyzer.
- **Jest**: Added Jest for future testings

### Improvements

- **Reports**: Patched the unlink error when the "reports" folder is not empty.

## Version 0.1.0 - 2024-09-16

## New Features

- **New command**: Added a new command to define which type of report you want to generate.
- **HTML Reports**: Added support for generating HTML reports from analysis, making it easier to visualize results.

## Version 0.0.9 - 2024-09-15

### New Features

- **Python Support**: Added basic Python support, allowing analysis of Python files with new rules for casing, maximum lines, and docstring requirements.
- **Expanded Rules for Python**: Introduced key rules for Python, including casing conventions (`PascalCase` for classes, `snake_case` for functions, methods, and parameters), maximum lines per file, function, and method, as well as requirements for function and class descriptions.
- **Casing Rules for JavaScript & TypeScript**: Added casing rules to enforce consistent naming conventions across all JavaScript, TypeScript, and Python projects.
- **Rule Customization**: Support for custom rule configuration in `.labinsight` files, allowing projects to define and adjust rules based on team standards.

### Improvements

- **Rule Validation**: Improved validation for existing JavaScript, TypeScript, and Python rules, ensuring more accurate detection of code quality issues.
- **Configuration Schema Update**: The configuration schema now supports a broader range of rule definitions and project-specific options, making customization easier.

### Bug Fixes

- **Try-Catch Rule**: Fixed an issue with `JSRequireTryCatchRule` where some asynchronous code blocks were not properly detected for missing `try-catch` statements.
- **Casing Rules**: Fixed casing rule issues to ensure correct enforcement for methods, parameters, and properties across languages.

## Version 0.0.8 - 2024-09-13

### New Features

- **JavaScript Support**: Added support for JavaScript analysis, enabling rules and analyzers to parse and analyze JavaScript files seamlessly alongside TypeScript.
- **Typed Declarations**: Added TypeScript types and declarations throughout the project, making it easier for developers to import and use Labinsight in their own projects.
- **Improved Basic & Deep Analysis**: Refactored the `BasicAnalyzer` and `DeepAnalyzer` to work with the new language detection system, ensuring that analysis is performed accurately based on the file's language.
- **JSON Report Enhancement**: JSON reports are now more consistent and modular, with language-specific data available in each report.

### Improvements

- **Cleaner Architecture**: Further modularized the file and directory structure, making it easier to extend and support more languages in the future.
- **Optimized File Handling**: Improved how rules and analyzers are applied based on file types, ensuring better performance and scalability.

### Fixed Issues

- **Dependency Analyzer Integration**: Fixed an issue where the Dependency Analyzer was not being utilized correctly, leading to incomplete dependency checks.
- **Empty Set Issue**: Resolved a problem where empty arrays were being added to a `Set`, ensuring accurate and efficient set operations.

## Version 0.0.7 - 2024-09-11

### New Features

- **JSON reports**: Introduced JSON report generation. Reports are now automatically saved in the ./reports directory.
- **Keep reports**: Added the `labinsight analyze -k` or `labinsight analyze --keep` option to retain previous reports in the folder, preventing them from being overwritten.

### Improvements

- **Async analysis**: Fixed the overlap between basic and deep analyzers by properly handling asynchronous execution.
- **Redundant code**: Removed redundant code in the analyzers and file management for a more optimized codebase.
- **Removed options** Removed deprecated configurations (`config`, `casing`, `decorators`) in favor of the new `rules` and `customRules` system for a cleaner, more flexible configuration.

## Version 0.0.6 - 2024-09-11

### Improvements

- **CLI patch**: Fixed the "bin" field in package.json to ensure the CLI commands work properly !
- **Improved structure**: Refactored the project structure for better modularity, facilitating the addition of more languages in the future.

## Version 0.0.5 - 2024-09-11

## Version 0.0.4 - 2024-09-11

### New Features

- **New command**: Added a new command to generate a custom rule file.
- **Better reports**: Improved reporting for deep analysis, providing more detailed insights and metrics.
- **Type argument**: Added `labinsight analyze --type=<full, dependencies, basic, deep>` argument instead of interactive selection.
- **Silent argument**: Added `labinsight analyze -s` or `analyze --silent` to suppress unessential messages during the analysis.

### Improvements

- **Improved custom rules**: Refactored to make custom rules more modular, enabling easier management via dedicated files. [See docs/customRules.md](https://github.com/techfever-soft/labinsight/blob/main/docs/customRules.md)

## Version 0.0.3 - 2024-09-10

### New Features

- **Custom Rules**: Added support for custom rules in the `.labinsight` configuration file. Users can now define and customize rules specific to their project needs.
- **JSON Schema**: Introduced a JSON schema for the `.labinsight` configuration file, improving validation and helping users understand the expected structure.
- **Ignored Files and Directories**: Added support for specifying ignored files and directories in the `.labinsight` configuration. This allows users to exclude specific files or directories from the analysis.

### Improvements

- **Initialization Patch**: Fixed issues related to the initialization of the `.labinsight` configuration file. The initialization process is now more reliable and works across different project structures.
- **Rule System Modularization**: Began modularizing the rule system to support multiple languages in future updates. This improves scalability and prepares Labinsight for analyzing more than just JavaScript/TypeScript projects.

### Enhancements to Rule Handling

- **Improved Rule Flexibility**: Simplified the structure for adding rules to make them easier to use and include in projects. This provides a better developer experience when configuring custom rules.
- **Predefined Ignored Files/Directories**: Added common ignored files and directories to the configuration (e.g., `.git`, `node_modules`, `dist`) to streamline project setup.

### Other

- Added this changelog to track future updates and improvements.
