// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------

// tslint:disable:max-func-body-length align

import * as assert from "assert";
import { Json } from "../extension.bundle";

suite("bug", () => {
    suite("bug", () => {
        console.log("Suite: bug");
        test("with null text", () => {
            console.log("Test: bug: 1");
            try {
                console.log("Test: bug: 2");
                Json.parse(null);
                assert.fail("Expected exception");
            } catch (err) {
                console.log("Test: bug: 3");
            }
            console.log("Test: bug: 4");
        });
    });
});
