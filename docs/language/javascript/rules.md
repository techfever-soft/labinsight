![](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/Frame%203.png?alt=media&token=a104bd9c-f7bd-45ee-83d0-5049b0d3cf4d)

# JavaScript Rules

## Overview

This document outlines the rules for JavaScript code analysis defined in the configuration. Each rule specifies its severity and, where applicable, its options.

## Rules

### `js.max-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 100
- **Description**: Enforces a maximum number of lines per file for JavaScript.

### `js.max-method-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 25
- **Description**: Limits the number of lines allowed in a JavaScript method.

### `js.max-function-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 25
- **Description**: Limits the number of lines allowed in a JavaScript function.

### `js.max-array-length`

- **Severity**: Error
- **Options**:
  - `limit`: 50
- **Description**: Enforces a maximum number of elements in an array.

### `js.require-method-description`

- **Severity**: Error
- **Description**: Requires every JavaScript method to have a description (JSDoc or similar).

### `js.require-function-description`

- **Severity**: Error
- **Description**: Requires every JavaScript function to have a description (JSDoc or similar).

### `js.require-try-catch`

- **Severity**: Error
- **Description**: Ensures that asynchronous operations using `await` are surrounded by try-catch blocks.

### `js.casing-class`

- **Severity**: Error
- **Options**:
  - `casing`: PascalCase
- **Description**: Enforces PascalCase for class names.

### `js.casing-parameter`

- **Severity**: Error
- **Options**:
  - `casing`: camelCase
- **Description**: Enforces camelCase for function parameter names.

### `js.casing-method`

- **Severity**: Error
- **Options**:
  - `casing`: camelCase
- **Description**: Enforces camelCase for method names.

### `js.casing-property`

- **Severity**: Error
- **Options**:
  - `casing`: camelCase
- **Description**: Enforces camelCase for property names.
