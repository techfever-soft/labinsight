![](https://firebasestorage.googleapis.com/v0/b/lab-insight.appspot.com/o/Frame%203.png?alt=media&token=a104bd9c-f7bd-45ee-83d0-5049b0d3cf4d)

# Python Rules

## Overview

This document outlines the rules used for Python code analysis in your project. Each rule specifies its severity and, where applicable, its options.

## Rules

### Max Rules

#### `py.max-file-lines`
- **Severity**: Error
- **Options**:
  - `limit`: Defined by configuration
- **Description**: This rule ensures that a Python file does not exceed a maximum number of lines.

#### `py.max-function-lines`
- **Severity**: Error
- **Options**:
  - `limit`: Defined by configuration
- **Description**: This rule enforces a limit on the number of lines in a function.

#### `py.max-method-lines`
- **Severity**: Error
- **Options**:
  - `limit`: Defined by configuration
- **Description**: This rule enforces a limit on the number of lines in a method within a class.

### Require Rules

#### `py.require-function-description`
- **Severity**: Error
- **Description**: This rule requires that every function has a docstring description.

#### `py.require-class-description`
- **Severity**: Error
- **Description**: This rule requires that every class has a docstring description.

### Casing Rules

#### `py.casing-class`
- **Severity**: Error
- **Options**:
  - `casing`: `PascalCase`
- **Description**: This rule enforces that all class names follow the PascalCase convention.

#### `py.casing-function`
- **Severity**: Error
- **Options**:
  - `casing`: `snake_case`
- **Description**: This rule enforces that all function names follow the snake_case convention.

#### `py.casing-method`
- **Severity**: Error
- **Options**:
  - `casing`: `snake_case`
- **Description**: This rule enforces that all method names follow the snake_case convention.

#### `py.casing-parameter`
- **Severity**: Error
- **Options**:
  - `casing`: `snake_case`
- **Description**: This rule enforces that all parameter names in functions and methods follow the snake_case convention.

#### `py.casing-property`
- **Severity**: Error
- **Options**:
  - `casing`: `snake_case`
- **Description**: This rule enforces that all property names in classes follow the snake_case convention.
