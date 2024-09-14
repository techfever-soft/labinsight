![](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/Frame%203.png?alt=media&token=a104bd9c-f7bd-45ee-83d0-5049b0d3cf4d)

# TypeScript Rules

## Overview

This document outlines the rules for TypeScript code analysis defined in the configuration. Each rule specifies its severity and, where applicable, its options.

## Rules

### `ts.max-file-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 100
- **Description**: Enforces a maximum number of lines per file for TypeScript.

### `ts.max-class-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 50
- **Description**: Limits the number of lines allowed in a TypeScript class.

### `ts.max-method-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 5
- **Description**: Limits the number of lines allowed in a TypeScript method.

### `ts.max-function-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 5
- **Description**: Limits the number of lines allowed in a TypeScript function.

### `ts.max-interface-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 10
- **Description**: Limits the number of lines allowed in a TypeScript interface.

### `ts.max-enum-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 10
- **Description**: Limits the number of lines allowed in a TypeScript enum.

### `ts.max-type-lines`

- **Severity**: Error
- **Options**:
  - `limit`: 10
- **Description**: Limits the number of lines allowed in a TypeScript type alias.

### `ts.max-array-length`

- **Severity**: Error
- **Options**:
  - `limit`: 50
- **Description**: Enforces a maximum number of elements in a TypeScript array.

### `ts.require-function-description`

- **Severity**: Error
- **Description**: Requires every TypeScript function to have a description (JSDoc or similar).

### `ts.require-method-description`

- **Severity**: Error
- **Description**: Requires every TypeScript method to have a description (JSDoc or similar).

### `ts.require-class-description`

- **Severity**: Error
- **Description**: Requires every TypeScript class to have a description (JSDoc or similar).

### `ts.require-interface-description`

- **Severity**: Error
- **Description**: Requires every TypeScript interface to have a description (JSDoc or similar).

### `ts.require-try-catch`

- **Severity**: Error
- **Description**: Ensures that asynchronous operations using `await` are surrounded by try-catch blocks.

### `ts.casing-function`

- **Severity**: Error
- **Options**:
  - `casing`: camelCase
- **Description**: Enforces camelCase for function names.

### `ts.casing-class`

- **Severity**: Error
- **Options**:
  - `casing`: PascalCase
- **Description**: Enforces PascalCase for class names.

### `ts.casing-parameter`

- **Severity**: Error
- **Options**:
  - `casing`: camelCase
- **Description**: Enforces camelCase for function parameter names.

### `ts.casing-method`

- **Severity**: Error
- **Options**:
  - `casing`: camelCase
- **Description**: Enforces camelCase for method names.

### `ts.casing-property`

- **Severity**: Error
- **Options**:
  - `casing`: camelCase
- **Description**: Enforces camelCase for property names.

### `ts.casing-type`

- **Severity**: Error
- **Options**:
  - `casing`: PascalCase
- **Description**: Enforces PascalCase for type aliases.

### `ts.casing-interface`

- **Severity**: Error
- **Options**:
  - `casing`: PascalCase
- **Description**: Enforces PascalCase for interface names.

### `ts.casing-enum`

- **Severity**: Error
- **Options**:
  - `casing`: PascalCase
- **Description**: Enforces PascalCase for enum names.
