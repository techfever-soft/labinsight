# JavaScript Rules

## Overview

This document outlines the rules for JavaScript code analysis defined in the configuration. Each rule specifies its severity and, where applicable, its options.

## Rules

### `js.max-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 100
- **Description**: Enforces a maximum number of lines per file for JavaScript.

### `js.require-method-description`

- **Severity**: Warning
- **Description**: Requires methods to have a description in JavaScript.

### `js.require-try-catch`

- **Severity**: Error
- **Description**: Requires the use of try/catch blocks for error handling in JavaScript.

### `js.casing-class`

- **Severity**: Error
- **Options**:
  - `casing`: pascalCase
- **Description**: Enforces pascalCase naming for classes in JavaScript.

### `js.casing-parameter`

- **Severity**: Error
- **Options**:
  - `casing`: camelCase
- **Description**: Enforces camelCase naming for parameters in JavaScript.

### `js.casing-function`

- **Severity**: Error
- **Options**:
  - `casing`: camelCase
- **Description**: Enforces camelCase naming for functions in JavaScript.
