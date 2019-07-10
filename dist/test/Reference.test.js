"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-unused-expression
// tslint:disable:max-func-body-length
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
suite("Reference", () => {
    suite("List", () => {
        suite("constructor(Reference.Type, Span[])", () => {
            test("with null type", () => {
                assert.throws(() => { new extension_bundle_1.Reference.List(null); });
            });
            test("with undefined type", () => {
                assert.throws(() => { new extension_bundle_1.Reference.List(undefined); });
            });
            test("with null spans", () => {
                assert.throws(() => { new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Parameter, null); });
            });
            test("with undefined spans", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Parameter, undefined);
                assert.deepStrictEqual(list.kind, extension_bundle_1.Reference.ReferenceKind.Parameter);
                assert.deepStrictEqual(list.spans, []);
                assert.deepStrictEqual(list.length, 0);
            });
            test("with empty spans", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Parameter, []);
                assert.deepStrictEqual(list.kind, extension_bundle_1.Reference.ReferenceKind.Parameter);
                assert.deepStrictEqual(list.spans, []);
                assert.deepStrictEqual(list.length, 0);
            });
            test("with non-empty spans", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Parameter, [new extension_bundle_1.Language.Span(0, 1), new extension_bundle_1.Language.Span(2, 3)]);
                assert.deepStrictEqual(list.kind, extension_bundle_1.Reference.ReferenceKind.Parameter);
                assert.deepStrictEqual(list.spans, [new extension_bundle_1.Language.Span(0, 1), new extension_bundle_1.Language.Span(2, 3)]);
                assert.deepStrictEqual(list.length, 2);
            });
        });
        suite("add(Span)", () => {
            test("with null", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Variable);
                assert.throws(() => { list.add(null); });
            });
            test("with undefined", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Variable);
                assert.throws(() => { list.add(undefined); });
            });
        });
        suite("addAll(Reference.List)", () => {
            test("with null", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Variable);
                assert.throws(() => { list.addAll(null); });
            });
            test("with undefined", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Variable);
                assert.throws(() => { list.addAll(undefined); });
            });
            test("with empty list of the same type", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Variable);
                list.addAll(new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Variable));
                assert.deepStrictEqual(list.length, 0);
                assert.deepStrictEqual(list.spans, []);
            });
            test("with empty list of a different type", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Variable);
                assert.throws(() => { list.addAll(new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Parameter)); });
            });
            test("with non-empty list", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Variable);
                list.addAll(new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Variable, [new extension_bundle_1.Language.Span(10, 20)]));
                assert.deepStrictEqual(list.spans, [new extension_bundle_1.Language.Span(10, 20)]);
            });
        });
        suite("translate(number)", () => {
            test("with empty list", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Parameter);
                const list2 = list.translate(17);
                assert.deepStrictEqual(list, list2);
            });
            test("with non-empty list", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Parameter, [new extension_bundle_1.Language.Span(10, 20)]);
                const list2 = list.translate(17);
                assert.deepStrictEqual(list2, new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Parameter, [new extension_bundle_1.Language.Span(27, 20)]));
            });
            test("with null movement", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Parameter, [new extension_bundle_1.Language.Span(10, 20)]);
                assert.throws(() => { list.translate(null); });
            });
            test("with undefined movement", () => {
                const list = new extension_bundle_1.Reference.List(extension_bundle_1.Reference.ReferenceKind.Parameter, [new extension_bundle_1.Language.Span(10, 20)]);
                assert.throws(() => { list.translate(undefined); });
            });
        });
    });
});
//# sourceMappingURL=Reference.test.js.map