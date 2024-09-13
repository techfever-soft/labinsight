import { TSClassCasingRule } from "./rules/casing/tsClassCasingRule";
import { TSEnumCasingRule } from "./rules/casing/tsEnumCasingRule";
import { TSFunctionCasingRule } from "./rules/casing/tsFunctionCasingRule";
import { TSInterfaceCasingRule } from "./rules/casing/tsInterfaceCasingRule";
import { TSMethodCasingRule } from "./rules/casing/tsMethodCasingRule";
import { TSParameterCasingRule } from "./rules/casing/tsParameterCasingRule";
import { TSPropertyCasingRule } from "./rules/casing/tsPropertyCasingRule";
import { TSTypeCasingRule } from "./rules/casing/tsTypeCasingRule";
import { TSLimitRecursionDepthRule } from "./rules/limit/tsLimitRecursionDepthRule";
import { TSMaxArrayLengthRule } from "./rules/max/tsMaxArrayLengthRule";
import { TSMaxLinesRule } from "./rules/max/tsMaxLinesRules";
import { TSMaxMethodLinesRule } from "./rules/max/tsMaxMethodLinesRule";
import { TSNoGlobalStateRule } from "./rules/no/tsNoGlobalState";
import { TSRequireClassDescriptionRule } from "./rules/require/tsRequireClassDescriptionRule";
import { TSRequireInterfaceDescriptionRule } from "./rules/require/tsRequireInterfaceDescription";
import { TSRequireMethodDescriptionRule } from "./rules/require/tsRequireMethodDescriptionRule";
import { TSRequireTryCatchRule } from "./rules/require/tsRequireTryCatchRule";

export const tsRules: { [ruleName: string]: any } = {
  // Max rules
  "ts.max-lines": TSMaxLinesRule,
  "ts.max-method-lines": TSMaxMethodLinesRule,
  "ts.max-array-length": TSMaxArrayLengthRule,

  // Require rules
  "ts.require-method-description": TSRequireMethodDescriptionRule,
  "ts.require-class-description": TSRequireClassDescriptionRule,
  "ts.require-interface-description": TSRequireInterfaceDescriptionRule,
  "ts.require-try-catch": TSRequireTryCatchRule,
  // "ts.require-explicit-access-modifiers": null,
  // "ts.require-parameter-annotations": TSRequireParameterAnnotationsRule,
  // "ts.require-return-annotations": TSRequireReturnAnnotationsRule,

  // Casing rules
  "ts.casing-function": TSFunctionCasingRule,
  "ts.casing-class": TSClassCasingRule,
  "ts.casing-parameter": TSParameterCasingRule,
  "ts.casing-method": TSMethodCasingRule,
  "ts.casing-property": TSPropertyCasingRule,
  "ts.casing-type": TSTypeCasingRule,
  "ts.casing-interface": TSInterfaceCasingRule,
  "ts.casing-enum": TSEnumCasingRule,

  // Limit rules
  "ts.limit-recursion-depth": TSLimitRecursionDepthRule,
  // "ts.limit-ternary-operator-count": null,
  // "ts.limit-parameter-count": null,
  // "ts.limit-import-count": null,
  // "ts.limit-exports-count": null,

  // // No rules
  // "ts.no-eval": TSNoEvalRule,
  "ts.no-global-state": TSNoGlobalStateRule,
  // "ts.no-console-log": null,
  // "ts.no-empty-catch-blocks": TSNoEmptyCatchBlocksRule,
  // "ts.no-unnecessary-async": null,
  // "ts.no-hardcoded-strings": null,
  // "ts.no-single-letter-names": null,
  // "ts.no-magic-numbers": null,
};
