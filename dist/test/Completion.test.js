"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
suite("Completion", () => {
    suite("Item", () => {
        test("constructor(string, Span, string, string, Type)", () => {
            const item = new extension_bundle_1.Completion.Item("a", "b", new extension_bundle_1.Language.Span(1, 2), "c", "d", extension_bundle_1.Completion.CompletionKind.Function);
            assert.deepStrictEqual(item.description, "d");
            assert.deepStrictEqual(item.detail, "c");
            assert.deepStrictEqual(item.insertSpan, new extension_bundle_1.Language.Span(1, 2));
            assert.deepStrictEqual(item.insertText, "b");
            assert.deepStrictEqual(item.name, "a");
            assert.deepStrictEqual(item.kind, extension_bundle_1.Completion.CompletionKind.Function);
        });
    });
});
//# sourceMappingURL=Completion.test.js.map