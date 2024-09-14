import { TSClassCasingRule } from "./rules/casing/tsClassCasingRule";
import { TSEnumCasingRule } from "./rules/casing/tsEnumCasingRule";
import { TSFunctionCasingRule } from "./rules/casing/tsFunctionCasingRule";
import { TSInterfaceCasingRule } from "./rules/casing/tsInterfaceCasingRule";
import { TSMethodCasingRule } from "./rules/casing/tsMethodCasingRule";
import { TSParameterCasingRule } from "./rules/casing/tsParameterCasingRule";
import { TSPropertyCasingRule } from "./rules/casing/tsPropertyCasingRule";
import { TSTypeCasingRule } from "./rules/casing/tsTypeCasingRule";
import { TSLimitRecursionDepthRule } from "./rules/limit/tsLimitRecursionDepthRule";
import { TSLimitTernaryOperatorRule } from "./rules/limit/tsLimitTernaryOperatorRule";
import { TSMaxArrayLengthRule } from "./rules/max/tsMaxArrayLengthRule";
import { TSMaxClassLinesRule } from "./rules/max/tsMaxClassLinesRule";
import { TSMaxEnumLinesRule } from "./rules/max/tsMaxEnumLinesRule";
import { TSMaxFileLinesRule } from "./rules/max/tsMaxFileLinesRule";
import { TSMaxFunctionLinesRule } from "./rules/max/tsMaxFunctionLinesRule";
import { TSMaxInterfaceLinesRule } from "./rules/max/tsMaxInterfaceLinesRule";
import { TSMaxMethodLinesRule } from "./rules/max/tsMaxMethodLinesRule";
import { TSMaxTypeLinesRule } from "./rules/max/tsMaxTypeLinesRule";
import { TSNoGlobalStateRule } from "./rules/no/tsNoGlobalState";
import { TSRequireClassDescriptionRule } from "./rules/require/tsRequireClassDescriptionRule";
import { TSRequireFunctionDescriptionRule } from "./rules/require/tsRequireFunctionDescriptionRule";
import { TSRequireInterfaceDescriptionRule } from "./rules/require/tsRequireInterfaceDescription";
import { TSRequireMethodDescriptionRule } from "./rules/require/tsRequireMethodDescriptionRule";
import { TSRequireTryCatchRule } from "./rules/require/tsRequireTryCatchRule";

export const tsRules: { [ruleName: string]: any } = {
  // Max rules
  "ts.max-file-lines": TSMaxFileLinesRule,
  "ts.max-method-lines": TSMaxMethodLinesRule,
  "ts.max-class-lines": TSMaxClassLinesRule,
  "ts.max-function-lines": TSMaxFunctionLinesRule,
  "ts.max-interface-lines": TSMaxInterfaceLinesRule,
  "ts.max-enum-lines": TSMaxEnumLinesRule,
  "ts.max-type-lines": TSMaxTypeLinesRule,
  "ts.max-array-length": TSMaxArrayLengthRule,

  // Require rules
  "ts.require-function-description": TSRequireFunctionDescriptionRule,
  "ts.require-method-description": TSRequireMethodDescriptionRule,
  "ts.require-class-description": TSRequireClassDescriptionRule,
  "ts.require-interface-description": TSRequireInterfaceDescriptionRule,
  "ts.require-try-catch": TSRequireTryCatchRule,
  // "ts.require-parameter-annotations": null,
  // "ts.require-return-annotations": null,
  // "ts.require-explicit-access-modifiers": null,

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
  "ts.limit-ternary-operator": TSLimitTernaryOperatorRule,
  // "ts.limit-parameter": null,
  // "ts.limit-import": null,
  // "ts.limit-exports": null,

  // No rules
  "ts.no-global-state": TSNoGlobalStateRule,
  "ts.no-eval": null,
  // "ts.no-console-log": null,
  // "ts.no-unnecessary-async": null,
  // "ts.no-hardcoded-strings": null,
  // "ts.no-single-letter-names": null,
  // "ts.no-magic-numbers": null,
};
