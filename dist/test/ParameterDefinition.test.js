"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-unused-expression
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
suite("ParameterDefinition", () => {
    suite("constructor(Json.Property)", () => {
        test("with null", () => {
            assert.throws(() => { new extension_bundle_1.ParameterDefinition(null); });
        });
        test("with undefined", () => {
            assert.throws(() => { new extension_bundle_1.ParameterDefinition(undefined); });
        });
        test("with property with no metadata", () => {
            const parameterName = new extension_bundle_1.Json.StringValue(new extension_bundle_1.Language.Span(0, 13), "parameterName");
            const parameterDefinition = new extension_bundle_1.Json.ObjectValue(new extension_bundle_1.Language.Span(16, 2), []);
            const property = new extension_bundle_1.Json.Property(parameterName.span.union(parameterDefinition.span), parameterName, parameterDefinition);
            const pd = new extension_bundle_1.ParameterDefinition(property);
            assert.deepStrictEqual(pd.name, parameterName);
            assert.deepStrictEqual(pd.description, null);
            assert.deepStrictEqual(pd.span, new extension_bundle_1.Language.Span(0, 18));
        });
    });
});
//# sourceMappingURL=ParameterDefinition.test.js.map