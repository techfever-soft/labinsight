import { JSClassCasingRule } from "./rules/casing/jsClassCasingRule";
import { JSMethodCasingRule } from "./rules/casing/jsMethodCasingRule";
import { JSParameterCasingRule } from "./rules/casing/jsParameterCasingRule";
import { JSPropertyCasingRule } from "./rules/casing/jsPropertyCasingRule";
import { JSLimitRecursionDepthRule } from "./rules/limit/jsLimitRecursionDepthRule";
import { JSLimitTernaryOperatorRule } from "./rules/limit/jsLimitTernaryOperatorRule";
import { JSMaxArrayLengthRule } from "./rules/max/jsMaxArrayLengthRule";
import { JSMaxFunctionLinesRule } from "./rules/max/jsMaxFunctionLinesRule";
import { JSMaxLinesRule } from "./rules/max/jsMaxLinesRule";
import { JSMaxMethodLinesRule } from "./rules/max/jsMaxMethodLinesRule";
import { JSRequireFunctionDescriptionRule } from "./rules/require/jsRequireFunctionDescriptionRule";
import { JSRequireMethodDescriptionRule } from "./rules/require/jsRequireMethodDescriptionRule";
import { JSRequireTryCatchRule } from "./rules/require/jsRequireTryCatchRule";

export const jsRules: { [ruleName: string]: any } = {
  // Max rules
  "js.max-lines": JSMaxLinesRule,
  "js.max-function-lines": JSMaxFunctionLinesRule,
  "js.max-method-lines": JSMaxMethodLinesRule,
  "js.max-array-length": JSMaxArrayLengthRule,

  // Require rules
  "js.require-method-description": JSRequireMethodDescriptionRule,
  "js.require-function-description": JSRequireFunctionDescriptionRule,
  "js.require-try-catch": JSRequireTryCatchRule,

  // Casing rules
  "js.casing-class": JSClassCasingRule,
  "js.casing-parameter": JSParameterCasingRule,
  "js.casing-method": JSMethodCasingRule,
  "js.casing-property": JSPropertyCasingRule,

  // Limit rules
  "js.limit-recursion-depth": JSLimitRecursionDepthRule,
  "js.limit-ternary-operator": JSLimitTernaryOperatorRule,

  // No rules
  "js.no-global-state": null, // Empêche l’utilisation de l’état global
  "js.no-eval": null, // Empêche l’utilisation de la fonction `eval`
  "js.no-console-log": null, // Empêche l’utilisation de `console.log`
};
