"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-func-body-length no-http-string max-line-length
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
suite("Utilities", () => {
    suite("clone(any)", () => {
        test("With null", () => {
            assert.deepEqual(null, extension_bundle_1.Utilities.clone(null));
        });
        test("With undefined", () => {
            assert.deepEqual(undefined, extension_bundle_1.Utilities.clone(undefined));
        });
        test("With number", () => {
            assert.deepEqual(50, extension_bundle_1.Utilities.clone(50));
        });
        test("With string", () => {
            assert.deepEqual("hello", extension_bundle_1.Utilities.clone("hello"));
        });
        test("With empty object", () => {
            let emptyObject = {};
            let clone = extension_bundle_1.Utilities.clone(emptyObject);
            assert.deepEqual(emptyObject, clone);
            // tslint:disable-next-line:no-string-literal
            clone["name"] = "value";
            assert.deepEqual({}, emptyObject);
            assert.deepEqual({ name: "value" }, clone);
        });
        test("With empty array", () => {
            let emptyArray = [];
            let clone = extension_bundle_1.Utilities.clone(emptyArray);
            assert.deepEqual(emptyArray, clone);
            clone.push("test");
            assert.deepEqual([], emptyArray);
            assert.deepEqual(["test"], clone);
        });
        test("With object with string property", () => {
            let value = { hello: "there" };
            let clone = extension_bundle_1.Utilities.clone(value);
            assert.deepEqual(value, clone);
            // tslint:disable-next-line:no-string-literal
            clone["test"] = "testValue";
            assert.deepEqual({ hello: "there" }, value);
            assert.deepEqual({ hello: "there", test: "testValue" }, clone);
        });
        test("With object with number property", () => {
            let value = { age: 3 };
            let clone = extension_bundle_1.Utilities.clone(value);
            assert.deepEqual(value, clone);
            // tslint:disable-next-line:no-string-literal
            clone["test"] = "testValue";
            assert.deepEqual({ age: 3 }, value);
            assert.deepEqual({ age: 3, test: "testValue" }, clone);
        });
        test("With object with boolean property", () => {
            let value = { okay: true };
            let clone = extension_bundle_1.Utilities.clone(value);
            assert.deepEqual(value, clone);
            // tslint:disable-next-line:no-string-literal
            clone["test"] = "testValue";
            assert.deepEqual({ okay: true }, value);
            assert.deepEqual({ okay: true, test: "testValue" }, clone);
        });
    });
    suite("isWhitespaceCharacter(string)", () => {
        test("With null", () => {
            assert.equal(false, extension_bundle_1.Utilities.isWhitespaceCharacter(null));
        });
        test("With empty", () => {
            assert.equal(false, extension_bundle_1.Utilities.isWhitespaceCharacter(""));
        });
        test("With more than 1 character", () => {
            assert.equal(false, extension_bundle_1.Utilities.isWhitespaceCharacter("ab"));
        });
        test("With non-whitespace character", () => {
            assert.equal(false, extension_bundle_1.Utilities.isWhitespaceCharacter("c"));
        });
        test("With space", () => {
            assert.equal(true, extension_bundle_1.Utilities.isWhitespaceCharacter(" "));
        });
        test("With tab", () => {
            assert.equal(true, extension_bundle_1.Utilities.isWhitespaceCharacter("\t"));
        });
        test("With carriage return", () => {
            assert.equal(true, extension_bundle_1.Utilities.isWhitespaceCharacter("\r"));
        });
        test("With newline", () => {
            assert.equal(true, extension_bundle_1.Utilities.isWhitespaceCharacter("\n"));
        });
    });
    suite("isQuoteCharacter(string)", () => {
        test("With null", () => {
            assert.equal(false, extension_bundle_1.Utilities.isQuoteCharacter(null));
        });
        test("With empty", () => {
            assert.equal(false, extension_bundle_1.Utilities.isQuoteCharacter(""));
        });
        test("With more than 1 character", () => {
            assert.equal(false, extension_bundle_1.Utilities.isQuoteCharacter("ab"));
        });
        test("With non-quote character", () => {
            assert.equal(false, extension_bundle_1.Utilities.isQuoteCharacter("c"));
        });
        test("With escaped single-quote", () => {
            assert.equal(true, extension_bundle_1.Utilities.isQuoteCharacter("\'"));
        });
        test("With unescaped single-quote", () => {
            assert.equal(true, extension_bundle_1.Utilities.isQuoteCharacter("'"));
        });
        test("With escaped double-quote", () => {
            assert.equal(true, extension_bundle_1.Utilities.isQuoteCharacter("\""));
        });
        test("With back-tick quote", () => {
            assert.equal(false, extension_bundle_1.Utilities.isQuoteCharacter("`"));
        });
    });
    suite("isDigit(string)", () => {
        test("With null", () => {
            assert.equal(false, extension_bundle_1.Utilities.isDigit(null));
        });
        test("With empty", () => {
            assert.equal(false, extension_bundle_1.Utilities.isDigit(""));
        });
        test("With more than 1 character", () => {
            assert.equal(false, extension_bundle_1.Utilities.isDigit("ab"));
        });
        test("With non-digit character", () => {
            assert.equal(false, extension_bundle_1.Utilities.isDigit("c"));
        });
        test("With Latin digits", () => {
            assert.equal(true, extension_bundle_1.Utilities.isDigit("0"));
            assert.equal(true, extension_bundle_1.Utilities.isDigit("1"));
            assert.equal(true, extension_bundle_1.Utilities.isDigit("2"));
            assert.equal(true, extension_bundle_1.Utilities.isDigit("3"));
            assert.equal(true, extension_bundle_1.Utilities.isDigit("4"));
            assert.equal(true, extension_bundle_1.Utilities.isDigit("5"));
            assert.equal(true, extension_bundle_1.Utilities.isDigit("6"));
            assert.equal(true, extension_bundle_1.Utilities.isDigit("7"));
            assert.equal(true, extension_bundle_1.Utilities.isDigit("8"));
            assert.equal(true, extension_bundle_1.Utilities.isDigit("9"));
        });
        test("With more than one digit", () => {
            assert.equal(true, extension_bundle_1.Utilities.isDigit("03"));
        });
    });
    suite("quote(string)", () => {
        test("with null", () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.quote(null), "null");
        });
        test("with undefined", () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.quote(undefined), "undefined");
        });
        test(`with ""`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.quote(""), `""`);
        });
        test(`with "hello"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.quote("hello"), `"hello"`);
        });
    });
    suite("escape(string)", () => {
        test("with null", () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escape(null), null);
        });
        test("with undefined", () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escape(undefined), undefined);
        });
        test(`with ""`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escape(""), "");
        });
        test(`with "hello"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escape("hello"), "hello");
        });
        test(`with "a\\bc"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escape("a\bc"), "a\\bc");
        });
        test(`with "e\\f"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escape("e\f"), "e\\f");
        });
        test(`with "\\no"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escape("\no"), "\\no");
        });
        test(`with "ca\\r"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escape("ca\r"), "ca\\r");
        });
        test(`with "ca\\t"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escape("ca\t"), "ca\\t");
        });
        test(`with "\\very"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escape("\very"), "\\very");
        });
    });
    suite("escapeAndQuote(string)", () => {
        test("with null", () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escapeAndQuote(null), "null");
        });
        test("with undefined", () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escapeAndQuote(undefined), "undefined");
        });
        test(`with ""`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escapeAndQuote(""), `""`);
        });
        test(`with "hello"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escapeAndQuote("hello"), `"hello"`);
        });
        test(`with "a\\bc"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escapeAndQuote("a\bc"), `"a\\bc"`);
        });
        test(`with "e\\f"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escapeAndQuote("e\f"), `"e\\f"`);
        });
        test(`with "\\no"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escapeAndQuote("\no"), `"\\no"`);
        });
        test(`with "ca\\r"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escapeAndQuote("ca\r"), `"ca\\r"`);
        });
        test(`with "ca\\t"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escapeAndQuote("ca\t"), `"ca\\t"`);
        });
        test(`with "\\very"`, () => {
            assert.deepStrictEqual(extension_bundle_1.Utilities.escapeAndQuote("\very"), `"\\very"`);
        });
    });
    suite("isValidSchemaUri(string)", () => {
        test("with null", () => {
            assert.equal(false, extension_bundle_1.Utilities.isValidSchemaUri(null));
        });
        test("with undefined", () => {
            assert.equal(false, extension_bundle_1.Utilities.isValidSchemaUri(undefined));
        });
        test("with 'hello world'", () => {
            assert.equal(false, extension_bundle_1.Utilities.isValidSchemaUri("hello world"));
        });
        test("with 'www.bing.com'", () => {
            assert.equal(false, extension_bundle_1.Utilities.isValidSchemaUri("www.bing.com"));
        });
        test("with 'https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#'", () => {
            assert.equal(true, extension_bundle_1.Utilities.isValidSchemaUri("https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#"));
        });
        test("with 'https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json'", () => {
            assert.equal(true, extension_bundle_1.Utilities.isValidSchemaUri("https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json"));
        });
        test("with 'http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json'", () => {
            assert.equal(true, extension_bundle_1.Utilities.isValidSchemaUri("http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json"));
        });
        test("with 'http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#'", () => {
            assert.equal(true, extension_bundle_1.Utilities.isValidSchemaUri("http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#"));
        });
        test("with 'https://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#'", () => {
            assert.equal(true, extension_bundle_1.Utilities.isValidSchemaUri("https://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#"));
        });
        test("subscription deployment template: 'https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#'", () => {
            assert.equal(true, extension_bundle_1.Utilities.isValidSchemaUri("https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#"));
        });
        test("subscription deployment template: 'http://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#'", () => {
            assert.equal(true, extension_bundle_1.Utilities.isValidSchemaUri("http://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#"));
        });
        test("subscription deployment template: 'http://schema.management.azure.com/schemas/xxxx-yy-zz/subscriptionDeploymentTemplate.json#'", () => {
            assert.equal(true, extension_bundle_1.Utilities.isValidSchemaUri("http://schema.management.azure.com/schemas/xxxx-yy-zz/subscriptionDeploymentTemplate.json#"));
        });
        test("false: subscription deployment template: 'http://schema.management.azure.com/schemas/xxxx-yy-zz/SubscriptionDeploymentTemplate.json#'", () => {
            assert.equal(false, extension_bundle_1.Utilities.isValidSchemaUri("http://schema.management.azure.com/schemas/xxxx-yy-zz/SubscriptionDeploymentTemplate.json#"));
        });
    });
});
//# sourceMappingURL=Utilities.test.js.map