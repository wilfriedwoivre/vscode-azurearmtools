"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-http-string
// tslint:disable:promise-function-async
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
const networkTest_test_1 = require("./networkTest.test");
suite("HttpClient", () => {
    suite("get(string)", () => {
        networkTest_test_1.networkTest("with existing site ('http://www.bing.com')", () => {
            return extension_bundle_1.httpGet("http://www.bing.com")
                .then((content) => {
                assert(content, "Content was undefined, null, or empty");
                assert(content.includes("Bing"), "Content did not include the phrase 'Bing'");
            });
        });
        networkTest_test_1.networkTest("with existing site without 'http' ('www.bing.com')", () => {
            return extension_bundle_1.httpGet("www.bing.com")
                .then((content) => {
                assert(content, "Content was undefined, null, or empty");
                assert(content.includes("Bing"), "Content did not include the phrase 'Bing'");
            });
        });
        networkTest_test_1.networkTest("with redirection ('https://storageexplorer.com') (redirection)", () => {
            return extension_bundle_1.httpGet("https://storageexplorer.com")
                .then((content) => {
                assert(content, "No content");
                assert(content.includes("Azure Storage Explorer"), "Doesn't include 'Azure Storage Explorer'");
            });
        });
        networkTest_test_1.networkTest("with non-existing site ('http://i.dont.exist.com')", () => {
            return extension_bundle_1.httpGet("http://i.dont.exist.com")
                .then((content) => {
                assert(false, "Expected the catch function to be called.");
            })
                // tslint:disable-next-line:no-any
                .catch((reason) => {
                assert(reason);
                assert.deepStrictEqual(reason.code, "ENOTFOUND");
                assert.deepStrictEqual(reason.errno, "ENOTFOUND");
                assert.deepStrictEqual(reason.hostname, "i.dont.exist.com");
                assert.deepStrictEqual(reason.syscall, "getaddrinfo");
            });
        });
        // Not currently using these
        // networkTest("with https ('https://azurermtools.blob.core.windows.net/redirects/TemplateExplorerRedirect2.6.0.txt')", () => {
        //     return HttpClient.get("https://azurermtools.blob.core.windows.net/redirects/TemplateExplorerRedirect2.6.0.txt")
        //         .then((content: string) => {
        //             assert.deepStrictEqual(content.trim(), "https://azurermtools.blob.core.windows.net/templateexplorer2-6-0/");
        //         });
        // });
        // networkTest("with 'https://azurermtools.blob.core.windows.net/assets-azuresdk-2-9-0/ExpressionMetadata.json'", () => {
        //     return HttpClient.get("https://azurermtools.blob.core.windows.net/assets-azuresdk-2-9-0/ExpressionMetadata.json")
        //         .then((content: string) => {
        //             assert(content);
        //         });
        // });
    });
});
//# sourceMappingURL=httpGet.test.js.map