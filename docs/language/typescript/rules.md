# TypeScript Rules

## Overview

This document outlines the rules for TypeScript code analysis defined in the configuration. Each rule specifies its severity and, where applicable, its options.

## Rules

### `ts.max-lines`
- **Severity**: Error
- **Options**: 
  - `limit`: 100
- **Description**: Enforces a maximum number of lines per file.

### `ts.max-method-lines`
- **Severity**: Warning
- **Options**: 
  - `limit`: 25
- **Description**: Enforces a maximum number of lines per method.

### `ts.max-array-length`
- **Severity**: Error
- **Options**: 
  - `limit`: 100
- **Description**: Enforces a maximum length for arrays.

### `ts.require-method-description`
- **Severity**: Warning
- **Description**: Requires methods to have a description.

### `ts.require-class-description`
- **Severity**: Warning
- **Description**: Requires classes to have a description.

### `ts.require-interface-description`
- **Severity**: Warning
- **Description**: Requires interfaces to have a description.

### `ts.require-try-catch`
- **Severity**: Error
- **Description**: Requires the use of try/catch blocks for error handling.

### `ts.casing-function`
- **Severity**: Error
- **Options**: 
  - `casing`: camelCase
- **Description**: Enforces camelCase naming for functions.

### `ts.casing-class`
- **Severity**: Error
- **Options**: 
  - `casing`: pascalCase
- **Description**: Enforces pascalCase naming for classes.

### `ts.casing-parameter`
- **Severity**: Error
- **Options**: 
  - `casing`: camelCase
- **Description**: Enforces camelCase naming for parameters.

### `ts.casing-method`
- **Severity**: Error
- **Options**: 
  - `casing`: camelCase
- **Description**: Enforces camelCase naming for methods.

### `ts.casing-property`
- **Severity**: Error
- **Options**: 
  - `casing`: camelCase
- **Description**: Enforces camelCase naming for properties.

### `ts.casing-type`
- **Severity**: Error
- **Options**: 
  - `casing`: pascalCase
- **Description**: Enforces pascalCase naming for types.

### `ts.casing-interface`
- **Severity**: Error
- **Options**: 
  - `casing`: pascalCase
- **Description**: Enforces pascalCase naming for interfaces.

### `ts.casing-enum`
- **Severity**: Error
- **Options**: 
  - `casing`: pascalCase
- **Description**: Enforces pascalCase naming for enums.

### `ts.limit-recursion-depth`
- **Severity**: Error
- **Options**: 
  - `limit`: 3
- **Description**: Enforces a maximum recursion depth.

### `ts.no-global-state`
- **Severity**: Error
- **Description**: Disallows global state.
