import { PyCasingClassRule } from "./rules/casing/pyCasingClassRule";
import { PyCasingFunctionRule } from "./rules/casing/pyCasingFunctionRule";
import { PyCasingMethodRule } from "./rules/casing/pyCasingMethod";
import { PyCasingParameterRule } from "./rules/casing/pyCasingParameterRule";
import { PyCasingPropertyRule } from "./rules/casing/pyCasingPropertyRule";
import { PyMaxLines } from "./rules/max/pyMaxFileLinesRule";
import { PyMaxFunctionLines } from "./rules/max/pyMaxFunctionLinesRule";
import { PyMaxMethodLines } from "./rules/max/pyMaxMethodLinesRule";
import { PyRequireClassDescriptionRule } from "./rules/require/pyRequireClassDescriptionRule";
import { PyRequireFunctionDescriptionRule } from "./rules/require/pyRequireFunctionDescriptionRule";

export const pyRules: { [ruleName: string]: any } = {
  // Max rules
  "py.max-file-lines": PyMaxLines,
  "py.max-function-lines": PyMaxFunctionLines,
  "py.max-method-lines": PyMaxMethodLines,

  // Require rules
  "py.require-function-description": PyRequireFunctionDescriptionRule,
  "py.require-class-description": PyRequireClassDescriptionRule,

  // Casing rules
  "py.casing-class": PyCasingClassRule,
  "py.casing-function": PyCasingFunctionRule,
  "py.casing-method": PyCasingMethodRule,
  "py.casing-parameter": PyCasingParameterRule,
  "py.casing-property": PyCasingPropertyRule,
};
