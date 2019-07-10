"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
suite("Supported", () => {
    test("isLanguageIdSupported", () => {
        assert.equal(extension_bundle_1.isLanguageIdSupported('json'), true);
        assert.equal(extension_bundle_1.isLanguageIdSupported('jsonc'), true);
        assert.equal(extension_bundle_1.isLanguageIdSupported('JSON'), true);
        assert.equal(extension_bundle_1.isLanguageIdSupported('JSONC'), true);
        assert.equal(extension_bundle_1.isLanguageIdSupported('JSONC2'), false);
        assert.equal(extension_bundle_1.isLanguageIdSupported('2JSONC'), false);
        assert.equal(extension_bundle_1.isLanguageIdSupported(''), false);
        assert.equal(extension_bundle_1.isLanguageIdSupported(undefined), false);
        assert.equal(extension_bundle_1.isLanguageIdSupported(null), false);
    });
});
//# sourceMappingURL=supported.test.js.map