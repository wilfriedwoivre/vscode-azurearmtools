"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
suite("Hover", () => {
    suite("Function", () => {
        test("constructor(tle.FunctionMetadata,Span)", () => {
            const fhi = new extension_bundle_1.Hover.FunctionInfo("a", "b", "c", new extension_bundle_1.Language.Span(17, 7));
            assert.deepEqual("a", fhi.functionName);
            assert.deepEqual("**b**\nc", fhi.getHoverText());
            assert.deepEqual(new extension_bundle_1.Language.Span(17, 7), fhi.span);
        });
    });
    suite("ParameterReference", () => {
        suite("constructor(ParameterDefinition,Span)", () => {
            test("with description", () => {
                const prhi = new extension_bundle_1.Hover.ParameterReferenceInfo("a", "b", new extension_bundle_1.Language.Span(2, 3));
                assert.deepEqual("**a** (parameter)\nb", prhi.getHoverText());
                assert.deepEqual(new extension_bundle_1.Language.Span(2, 3), prhi.span);
            });
            test("with undefined description", () => {
                const prhi = new extension_bundle_1.Hover.ParameterReferenceInfo("a", undefined, new extension_bundle_1.Language.Span(2, 3));
                assert.deepEqual("**a** (parameter)", prhi.getHoverText());
                assert.deepEqual(new extension_bundle_1.Language.Span(2, 3), prhi.span);
            });
        });
    });
    suite("VariableReference", () => {
        test("constructor(VariableDefinition,Span)", () => {
            const prhi = new extension_bundle_1.Hover.VariableReferenceInfo("a", new extension_bundle_1.Language.Span(2, 3));
            assert.deepEqual("**a** (variable)", prhi.getHoverText());
            assert.deepEqual(new extension_bundle_1.Language.Span(2, 3), prhi.span);
        });
    });
});
//# sourceMappingURL=Hover.test.js.map