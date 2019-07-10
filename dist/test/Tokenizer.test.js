"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-func-body-length
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
suite("Tokenizer", () => {
    suite("Token", () => {
        function constructorTest(text, tokenType) {
            test(`with ${extension_bundle_1.Utilities.escapeAndQuote(text)}`, () => {
                const token = new extension_bundle_1.basic.Token(text, tokenType);
                assert.deepStrictEqual(token.toString(), text);
                assert.deepStrictEqual(token.length(), text.length);
                assert.deepStrictEqual(token.getType(), tokenType);
            });
        }
        constructorTest("(", 4 /* LeftParenthesis */);
        constructorTest("hello", 22 /* Letters */);
    });
    test("LeftCurlyBracket", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.LeftCurlyBracket, new extension_bundle_1.basic.Token("{", 0 /* LeftCurlyBracket */));
    });
    test("RightCurlyBracket", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.RightCurlyBracket, new extension_bundle_1.basic.Token("}", 1 /* RightCurlyBracket */));
    });
    test("LeftSquareBracket", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.LeftSquareBracket, new extension_bundle_1.basic.Token("[", 2 /* LeftSquareBracket */));
    });
    test("RightSquareBracket", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.RightSquareBracket, new extension_bundle_1.basic.Token("]", 3 /* RightSquareBracket */));
    });
    test("LeftParenthesis", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.LeftParenthesis, new extension_bundle_1.basic.Token("(", 4 /* LeftParenthesis */));
    });
    test("RightParenthesis", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.RightParenthesis, new extension_bundle_1.basic.Token(")", 5 /* RightParenthesis */));
    });
    test("Underscore", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Underscore, new extension_bundle_1.basic.Token("_", 6 /* Underscore */));
    });
    test("Period", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Period, new extension_bundle_1.basic.Token(".", 7 /* Period */));
    });
    test("Dash", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Dash, new extension_bundle_1.basic.Token("-", 8 /* Dash */));
    });
    test("Plus", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Plus, new extension_bundle_1.basic.Token("+", 9 /* Plus */));
    });
    test("Comma", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Comma, new extension_bundle_1.basic.Token(",", 10 /* Comma */));
    });
    test("Colon", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Colon, new extension_bundle_1.basic.Token(":", 11 /* Colon */));
    });
    test("SingleQuote", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.SingleQuote, new extension_bundle_1.basic.Token(`'`, 12 /* SingleQuote */));
    });
    test("DoubleQuote", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.DoubleQuote, new extension_bundle_1.basic.Token(`"`, 13 /* DoubleQuote */));
    });
    test("Backslash", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Backslash, new extension_bundle_1.basic.Token("\\", 14 /* Backslash */));
    });
    test("ForwardSlash", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.ForwardSlash, new extension_bundle_1.basic.Token("/", 15 /* ForwardSlash */));
    });
    test("Asterisk", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Asterisk, new extension_bundle_1.basic.Token("*", 16 /* Asterisk */));
    });
    test("Space", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Space, new extension_bundle_1.basic.Token(" ", 17 /* Space */));
    });
    test("Tab", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Tab, new extension_bundle_1.basic.Token("\t", 18 /* Tab */));
    });
    test("NewLine", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.NewLine, new extension_bundle_1.basic.Token("\n", 19 /* NewLine */));
    });
    test("CarriageReturn", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.CarriageReturn, new extension_bundle_1.basic.Token("\r", 20 /* CarriageReturn */));
    });
    test("CarriageReturnNewLine", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.CarriageReturnNewLine, new extension_bundle_1.basic.Token("\r\n", 21 /* CarriageReturnNewLine */));
    });
    test("Letters()", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Letters("abc"), new extension_bundle_1.basic.Token("abc", 22 /* Letters */));
    });
    test("Digits()", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Digits("123"), new extension_bundle_1.basic.Token("123", 23 /* Digits */));
    });
    test("Unrecognized()", () => {
        assert.deepStrictEqual(extension_bundle_1.basic.Unrecognized("&"), new extension_bundle_1.basic.Token("&", 24 /* Unrecognized */));
    });
    suite("Tokenizer", () => {
        suite("constructor()", () => {
            function constructorTest(text) {
                test(`with ${extension_bundle_1.Utilities.escapeAndQuote(text)}`, () => {
                    const tokenizer = new extension_bundle_1.basic.Tokenizer(text);
                    assert.deepStrictEqual(tokenizer.hasStarted(), false);
                    assert.deepStrictEqual(tokenizer.current(), undefined);
                });
            }
            constructorTest(null);
            constructorTest(undefined);
            constructorTest("");
            constructorTest("hello");
        });
        suite("next()", () => {
            function nextTest(text, expectedTokens) {
                if (!expectedTokens) {
                    expectedTokens = [];
                }
                else if (expectedTokens instanceof extension_bundle_1.basic.Token) {
                    expectedTokens = [expectedTokens];
                }
                test(`with ${extension_bundle_1.Utilities.escapeAndQuote(text)}`, () => {
                    const tokenizer = new extension_bundle_1.basic.Tokenizer(text);
                    for (const expectedToken of expectedTokens) {
                        tokenizer.moveNext();
                        assert.deepStrictEqual(tokenizer.hasStarted(), true);
                        assert.deepStrictEqual(tokenizer.current(), expectedToken);
                    }
                    for (let i = 0; i < 2; ++i) {
                        tokenizer.moveNext();
                        assert.deepStrictEqual(tokenizer.hasStarted(), true);
                        assert.deepStrictEqual(tokenizer.current(), undefined);
                    }
                });
            }
            nextTest(null);
            nextTest(undefined);
            nextTest("");
            nextTest("{", extension_bundle_1.basic.LeftCurlyBracket);
            nextTest("}", extension_bundle_1.basic.RightCurlyBracket);
            nextTest("[", extension_bundle_1.basic.LeftSquareBracket);
            nextTest("]", extension_bundle_1.basic.RightSquareBracket);
            nextTest("(", extension_bundle_1.basic.LeftParenthesis);
            nextTest(")", extension_bundle_1.basic.RightParenthesis);
            nextTest("_", extension_bundle_1.basic.Underscore);
            nextTest(".", extension_bundle_1.basic.Period);
            nextTest("-", extension_bundle_1.basic.Dash);
            nextTest("+", extension_bundle_1.basic.Plus);
            nextTest(",", extension_bundle_1.basic.Comma);
            nextTest(":", extension_bundle_1.basic.Colon);
            nextTest(`'`, extension_bundle_1.basic.SingleQuote);
            nextTest(`"`, extension_bundle_1.basic.DoubleQuote);
            nextTest("\\", extension_bundle_1.basic.Backslash);
            nextTest("/", extension_bundle_1.basic.ForwardSlash);
            nextTest("*", extension_bundle_1.basic.Asterisk);
            nextTest("\n", extension_bundle_1.basic.NewLine);
            nextTest("\r\n", extension_bundle_1.basic.CarriageReturnNewLine);
            nextTest(" ", extension_bundle_1.basic.Space);
            nextTest("   ", [extension_bundle_1.basic.Space, extension_bundle_1.basic.Space, extension_bundle_1.basic.Space]);
            nextTest("\t", extension_bundle_1.basic.Tab);
            nextTest("\t  ", [extension_bundle_1.basic.Tab, extension_bundle_1.basic.Space, extension_bundle_1.basic.Space]);
            nextTest("\r", extension_bundle_1.basic.CarriageReturn);
            nextTest("\r ", [extension_bundle_1.basic.CarriageReturn, extension_bundle_1.basic.Space]);
            nextTest("\r  ", [extension_bundle_1.basic.CarriageReturn, extension_bundle_1.basic.Space, extension_bundle_1.basic.Space]);
            nextTest("\r\t", [extension_bundle_1.basic.CarriageReturn, extension_bundle_1.basic.Tab]);
            nextTest("\r\r", [extension_bundle_1.basic.CarriageReturn, extension_bundle_1.basic.CarriageReturn]);
            nextTest("\rf", [extension_bundle_1.basic.CarriageReturn, extension_bundle_1.basic.Letters("f")]);
            nextTest("hello", extension_bundle_1.basic.Letters("hello"));
            nextTest("a", extension_bundle_1.basic.Letters("a"));
            nextTest("z", extension_bundle_1.basic.Letters("z"));
            nextTest("A", extension_bundle_1.basic.Letters("A"));
            nextTest("Z", extension_bundle_1.basic.Letters("Z"));
            nextTest("1", extension_bundle_1.basic.Digits("1"));
            nextTest("1234", extension_bundle_1.basic.Digits("1234"));
            nextTest("#", extension_bundle_1.basic.Unrecognized("#"));
            nextTest("^", extension_bundle_1.basic.Unrecognized("^"));
        });
    });
});
//# sourceMappingURL=Tokenizer.test.js.map