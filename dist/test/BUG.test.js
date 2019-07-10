"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-func-body-length align
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
suite("bug", () => {
    suite("bug", () => {
        console.log("Suite: bug");
        test("with null text", () => {
            console.log("Test: bug: 1");
            try {
                console.log("Test: bug: 2");
                extension_bundle_1.Json.parse(null);
                assert.fail("Expected exception");
            }
            catch (err) {
                console.log("Test: bug: 3");
            }
            console.log("Test: bug: 4");
        });
    });
});
//# sourceMappingURL=BUG.test.js.map