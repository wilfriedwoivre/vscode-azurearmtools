"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-func-body-length
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
suite("Duration", () => {
    suite("totalMilliseconds(number)", () => {
        test("With negative", () => {
            let d = extension_bundle_1.Duration.milliseconds(-5);
            assert.deepEqual(-5, d.totalMilliseconds);
        });
        test("With zero", () => {
            let d = extension_bundle_1.Duration.milliseconds(0);
            assert.deepEqual(0, d.totalMilliseconds);
        });
        test("With positive", () => {
            let d = extension_bundle_1.Duration.milliseconds(20);
            assert.deepEqual(20, d.totalMilliseconds);
        });
    });
    suite("totalSeconds(number)", () => {
        test("With negative", () => {
            let d = extension_bundle_1.Duration.seconds(-5);
            assert.deepEqual(-5000, d.totalMilliseconds);
            assert.deepEqual(-5, d.totalSeconds);
        });
        test("With zero", () => {
            let d = extension_bundle_1.Duration.seconds(0);
            assert.deepEqual(0, d.totalMilliseconds);
            assert.deepEqual(0, d.totalSeconds);
        });
        test("With positive", () => {
            let d = extension_bundle_1.Duration.seconds(20);
            assert.deepEqual(20000, d.totalMilliseconds);
            assert.deepEqual(20, d.totalSeconds);
        });
    });
    suite("plus(Duration)", () => {
        test("With null", () => {
            assert.throws(() => { extension_bundle_1.Duration.milliseconds(1).plus(null); });
        });
        test("With undefined", () => {
            assert.throws(() => { extension_bundle_1.Duration.milliseconds(1).plus(undefined); });
        });
        test("With zero", () => {
            assert.deepEqual(extension_bundle_1.Duration.milliseconds(1), extension_bundle_1.Duration.milliseconds(1).plus(extension_bundle_1.Duration.zero));
        });
        test("With negative duration", () => {
            assert.deepEqual(extension_bundle_1.Duration.milliseconds(-1), extension_bundle_1.Duration.milliseconds(1).plus(extension_bundle_1.Duration.milliseconds(-2)));
        });
    });
    suite("dividedBy(number)", () => {
        test("With null", () => {
            assert.throws(() => { extension_bundle_1.Duration.milliseconds(20).dividedBy(null); });
        });
        test("With undefined", () => {
            assert.throws(() => { extension_bundle_1.Duration.milliseconds(20).dividedBy(undefined); });
        });
        test("With zero", () => {
            assert.throws(() => { extension_bundle_1.Duration.milliseconds(20).dividedBy(0); });
        });
        test("With 1", () => {
            assert.deepEqual(extension_bundle_1.Duration.milliseconds(20), extension_bundle_1.Duration.milliseconds(20).dividedBy(1));
        });
        test("With 2", () => {
            assert.deepEqual(extension_bundle_1.Duration.milliseconds(10), extension_bundle_1.Duration.milliseconds(20).dividedBy(2));
        });
    });
    suite("lessThanOrEqualTo(Duration)", () => {
        test("With null", () => {
            assert.deepEqual(false, extension_bundle_1.Duration.milliseconds(20).lessThanOrEqualTo(null));
        });
        test("With undefined", () => {
            assert.deepEqual(false, extension_bundle_1.Duration.milliseconds(20).lessThanOrEqualTo(undefined));
        });
        test("With less than duration", () => {
            assert.deepEqual(false, extension_bundle_1.Duration.milliseconds(20).lessThanOrEqualTo(extension_bundle_1.Duration.milliseconds(19)));
        });
        test("With equal duration", () => {
            assert.deepEqual(true, extension_bundle_1.Duration.milliseconds(20).lessThanOrEqualTo(extension_bundle_1.Duration.milliseconds(20)));
        });
        test("With greater than duration", () => {
            assert.deepEqual(true, extension_bundle_1.Duration.milliseconds(20).lessThanOrEqualTo(extension_bundle_1.Duration.milliseconds(21)));
        });
    });
    suite("toString()", () => {
        test("With -1 milliseconds", () => {
            assert.deepEqual("-1 milliseconds", extension_bundle_1.Duration.milliseconds(-1).toString());
        });
        test("With 0 milliseconds", () => {
            assert.deepEqual("0 milliseconds", extension_bundle_1.Duration.milliseconds(0).toString());
        });
        test("With 1 millisecond", () => {
            assert.deepEqual("1 millisecond", extension_bundle_1.Duration.milliseconds(1).toString());
        });
        test("With 2 milliseconds", () => {
            assert.deepEqual("2 milliseconds", extension_bundle_1.Duration.milliseconds(2).toString());
        });
        test("With 1000 milliseconds", () => {
            assert.deepEqual("1000 milliseconds", extension_bundle_1.Duration.milliseconds(1000).toString());
        });
    });
});
//# sourceMappingURL=Duration.test.js.map