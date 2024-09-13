import { JSClassCasingRule } from "./rules/casing/jsClassCasingRule";
import { JSMethodCasingRule } from "./rules/casing/jsMethodCasingRule";
import { JSParameterCasingRule } from "./rules/casing/jsParameterCasingRule";
import { JSPropertyCasingRule } from "./rules/casing/jsPropertyCasingRule";
import { JSMaxLinesRule } from "./rules/max/jsMaxLinesRule";
import { JSMaxMethodLinesRule } from "./rules/max/jsMaxMethodLinesRule";
import { JSRequireMethodDescriptionRule } from "./rules/require/jsRequireMethodDescriptionRule";
import { JSRequireTryCatchRule } from "./rules/require/jsRequireTryCatchRule";

export const jsRules: { [ruleName: string]: any } = {
  // Max rules
  "js.max-lines": JSMaxLinesRule,
  "js.max-method-lines": JSMaxMethodLinesRule,
  //   "js.max-array-length": JSMaxArrayLengthRule,

  // Require rules
  "js.require-method-description": JSRequireMethodDescriptionRule,
  "js.require-try-catch": JSRequireTryCatchRule,

  // Casing rules
  "js.casing-class": JSClassCasingRule,
  "js.casing-parameter": JSParameterCasingRule,
  "js.casing-method": JSMethodCasingRule,
  "js.casing-property": JSPropertyCasingRule,

  // Limit rules
  //   "js.limit-recursion-depth": JSLimitRecursionDepthRule,

  // No rules
  //   "js.no-global-state": JSNoGlobalStateRule,
};
