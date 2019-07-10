"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-func-body-length align
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
/**
 * Convert the provided text string into a sequence of basic Tokens.
 */
function parseBasicTokens(text) {
    const result = [];
    const tokenizer = new extension_bundle_1.basic.Tokenizer(text);
    while (tokenizer.moveNext()) {
        result.push(tokenizer.current());
    }
    return result;
}
exports.parseBasicTokens = parseBasicTokens;
/**
 * Parse the provided text into a JSON Number token.
 */
function parseNumber(text, startIndex = 0) {
    return extension_bundle_1.Json.Number(startIndex, parseBasicTokens(text));
}
exports.parseNumber = parseNumber;
/**
 * Parse the provided text into a JSON Whitespace token.
 */
function parseWhitespace(text, startIndex = 0) {
    return extension_bundle_1.Json.Whitespace(startIndex, parseBasicTokens(text));
}
exports.parseWhitespace = parseWhitespace;
/**
 * Parse the provided text into a JSON QuotedString token.
 */
function parseQuotedString(text, startIndex = 0) {
    return extension_bundle_1.Json.QuotedString(startIndex, parseBasicTokens(text));
}
exports.parseQuotedString = parseQuotedString;
/**
 * Parse the provided text into a JSON Literal token.
 */
function parseLiteral(text, startIndex = 0) {
    return extension_bundle_1.Json.Literal(startIndex, parseBasicTokens(text));
}
exports.parseLiteral = parseLiteral;
/**
 * Parse the provided text into a JSON Boolean token.
 */
function parseBoolean(text, startIndex = 0) {
    const basicTokens = parseBasicTokens(text);
    assert.deepStrictEqual(basicTokens.length, 1, "Wrong basic tokens length.");
    return extension_bundle_1.Json.Boolean(startIndex, basicTokens[0]);
}
exports.parseBoolean = parseBoolean;
/**
 * Parse the provided text into a JSON Unrecognized token.
 */
function parseUnrecognized(text, startIndex = 0) {
    const basicTokens = parseBasicTokens(text);
    assert.deepStrictEqual(basicTokens.length, 1, "Wrong basic tokens length.");
    return extension_bundle_1.Json.Unrecognized(startIndex, basicTokens[0]);
}
exports.parseUnrecognized = parseUnrecognized;
/**
 * Parse the provided text into a JSON Comment token.
 */
function parseComment(text, startIndex = 0) {
    return extension_bundle_1.Json.Comment(startIndex, parseBasicTokens(text));
}
exports.parseComment = parseComment;
suite("JSON", () => {
    suite("ParseResult", () => {
        suite("tokenCount", () => {
            test("with 0 tokens", () => {
                assert.deepStrictEqual(0, extension_bundle_1.Json.parse("").tokenCount);
            });
            test("with 1 token", () => {
                let pr = extension_bundle_1.Json.parse("true");
                assert.notEqual(null, pr);
                assert.deepStrictEqual(1, pr.tokenCount);
            });
            test("with 2 tokens", () => {
                let pr = extension_bundle_1.Json.parse("[]");
                assert.notEqual(null, pr);
                assert.deepStrictEqual(2, pr.tokenCount);
            });
        });
        suite("getCharacterIndex(number,number)", () => {
            test("with negative line index", () => {
                let pr = extension_bundle_1.Json.parse("");
                assert.throws(() => { pr.getCharacterIndex(-1, 0); });
            });
            test("with negative column index", () => {
                let pr = extension_bundle_1.Json.parse("");
                assert.throws(() => { pr.getCharacterIndex(0, -1); });
            });
            test("with line index greater than input string line count", () => {
                let pr = extension_bundle_1.Json.parse("hello there");
                assert.throws(() => { pr.getCharacterIndex(1, 0); });
            });
            test("with column index greater than input string column length", () => {
                let pr = extension_bundle_1.Json.parse("hello there");
                assert.throws(() => {
                    pr.getCharacterIndex(0, "hello there".length + 1);
                });
            });
            test("with 0 column index on empty input string line length", () => {
                let pr = extension_bundle_1.Json.parse("");
                assert.deepStrictEqual(0, pr.getCharacterIndex(0, 0));
            });
            test("with a single line", () => {
                let pr = extension_bundle_1.Json.parse("hello there");
                assert.deepStrictEqual(0, pr.getCharacterIndex(0, 0));
                assert.deepStrictEqual(1, pr.getCharacterIndex(0, 1));
                assert.deepStrictEqual("hello".length, pr.getCharacterIndex(0, "hello".length));
                assert.deepStrictEqual("hello there".length, pr.getCharacterIndex(0, "hello there".length));
            });
            test("with multiple lines", () => {
                let pr = extension_bundle_1.Json.parse("a\nbb\n\nccc\ndddd");
                assert.deepStrictEqual([2, 3, 1, 4, 4], pr.lineLengths);
                assert.deepStrictEqual(0, pr.getCharacterIndex(0, 0));
                assert.deepStrictEqual(1, pr.getCharacterIndex(0, 1));
                assert.throws(() => { pr.getCharacterIndex(0, 2); });
                assert.deepStrictEqual(2, pr.getCharacterIndex(1, 0));
                assert.deepStrictEqual(3, pr.getCharacterIndex(1, 1));
                assert.deepStrictEqual(4, pr.getCharacterIndex(1, 2));
                assert.throws(() => { pr.getCharacterIndex(1, 3); });
                assert.deepStrictEqual(5, pr.getCharacterIndex(2, 0));
                assert.throws(() => { pr.getCharacterIndex(2, 1); });
                assert.deepStrictEqual(6, pr.getCharacterIndex(3, 0));
                assert.deepStrictEqual(7, pr.getCharacterIndex(3, 1));
                assert.deepStrictEqual(8, pr.getCharacterIndex(3, 2));
                assert.deepStrictEqual(9, pr.getCharacterIndex(3, 3));
                assert.throws(() => { pr.getCharacterIndex(3, 4); });
                assert.deepStrictEqual(10, pr.getCharacterIndex(4, 0));
                assert.deepStrictEqual(11, pr.getCharacterIndex(4, 1));
                assert.deepStrictEqual(12, pr.getCharacterIndex(4, 2));
                assert.deepStrictEqual(13, pr.getCharacterIndex(4, 3));
                assert.deepStrictEqual(14, pr.getCharacterIndex(4, 4));
                assert.throws(() => { pr.getCharacterIndex(4, 5); });
                assert.throws(() => { pr.getCharacterIndex(5, 0); });
            });
        });
        suite("getTokenAtCharacterIndex(number)", () => {
            test("with negative character index", () => {
                let pr = extension_bundle_1.Json.parse("49");
                assert.throws(() => { pr.getTokenAtCharacterIndex(-1); });
            });
            test("with character index deepStrictEqual to the character count", () => {
                let pr = extension_bundle_1.Json.parse("50");
                assert.deepStrictEqual(parseNumber("50", 0), pr.getTokenAtCharacterIndex(2));
            });
            test("with character index greater than the character count", () => {
                let pr = extension_bundle_1.Json.parse("51");
                assert.deepStrictEqual(null, pr.getTokenAtCharacterIndex(3));
            });
            test("with character index inside character index range", () => {
                let pr = extension_bundle_1.Json.parse("{ 'hello': 42 }  ");
                assert.deepStrictEqual(extension_bundle_1.Json.LeftCurlyBracket(0), pr.getTokenAtCharacterIndex(0));
                assert.deepStrictEqual(null, pr.getTokenAtCharacterIndex(1));
                assert.deepStrictEqual(extension_bundle_1.Json.QuotedString(2, parseBasicTokens("'hello'")), pr.getTokenAtCharacterIndex(2));
                assert.deepStrictEqual(extension_bundle_1.Json.Colon(9), pr.getTokenAtCharacterIndex(9));
                assert.deepStrictEqual(null, pr.getTokenAtCharacterIndex(10));
                assert.deepStrictEqual(parseNumber("42", 11), pr.getTokenAtCharacterIndex(11));
                assert.deepStrictEqual(null, pr.getTokenAtCharacterIndex(13));
                assert.deepStrictEqual(extension_bundle_1.Json.RightCurlyBracket(14), pr.getTokenAtCharacterIndex(14));
                assert.deepStrictEqual(extension_bundle_1.Json.RightCurlyBracket(14), pr.getTokenAtCharacterIndex(15));
                assert.deepStrictEqual(null, pr.getTokenAtCharacterIndex(16));
            });
        });
    });
    suite("parse(string)", () => {
        test("with null text", () => {
            assert.throws(() => { extension_bundle_1.Json.parse(null); });
        });
        test("with empty text", () => {
            let result = extension_bundle_1.Json.parse("");
            assert.deepStrictEqual(result.tokenCount, 0);
            assert.deepStrictEqual(result.lineLengths, [0]);
            assert.deepStrictEqual(result.value, null);
        });
        test("with quoted string", () => {
            let result = extension_bundle_1.Json.parse("'hello there'");
            assert.deepStrictEqual(result.tokenCount, 1);
            assert.deepStrictEqual(result.lineLengths, [13]);
            assert.deepStrictEqual(result.value, new extension_bundle_1.Json.StringValue(new extension_bundle_1.Language.Span(0, 13), "hello there"));
        });
        test("with number", () => {
            let result = extension_bundle_1.Json.parse("14");
            assert.deepStrictEqual(result.tokenCount, 1);
            assert.deepStrictEqual(result.lineLengths, [2]);
            assert.deepStrictEqual(result.value, new extension_bundle_1.Json.NumberValue(new extension_bundle_1.Language.Span(0, 2), "14"));
        });
        test("with boolean (false)", () => {
            let result = extension_bundle_1.Json.parse("false");
            assert.deepStrictEqual(result.tokenCount, 1);
            assert.deepStrictEqual(result.lineLengths, [5]);
            assert.deepStrictEqual(result.value, new extension_bundle_1.Json.BooleanValue(new extension_bundle_1.Language.Span(0, 5), false));
        });
        test("with boolean (true)", () => {
            let result = extension_bundle_1.Json.parse("true");
            assert.deepStrictEqual(result.tokenCount, 1);
            assert.deepStrictEqual(result.lineLengths, [4]);
            assert.deepStrictEqual(result.value, new extension_bundle_1.Json.BooleanValue(new extension_bundle_1.Language.Span(0, 4), true));
        });
        test("with left curly bracket", () => {
            let result = extension_bundle_1.Json.parse("{");
            assert.deepStrictEqual(result.tokenCount, 1);
            assert.deepStrictEqual(result.lineLengths, [1]);
            assert.deepStrictEqual(result.value, new extension_bundle_1.Json.ObjectValue(new extension_bundle_1.Language.Span(0, 1), []));
        });
        test("with right curly bracket", () => {
            let result = extension_bundle_1.Json.parse("}");
            assert.deepStrictEqual(result.tokenCount, 1);
            assert.deepStrictEqual(result.lineLengths, [1]);
            assert.deepStrictEqual(result.value, null);
        });
        test("with empty object", () => {
            let result = extension_bundle_1.Json.parse("{}");
            assert.deepStrictEqual(result.tokenCount, 2);
            assert.deepStrictEqual(result.lineLengths, [2]);
            assert.deepStrictEqual(result.value, new extension_bundle_1.Json.ObjectValue(new extension_bundle_1.Language.Span(0, 2), []));
        });
        test("with object with one string property", () => {
            const result = extension_bundle_1.Json.parse("{ 'name': 'Dan' }");
            assert.deepStrictEqual(result.tokenCount, 5);
            assert.deepStrictEqual(result.lineLengths, [17]);
            const v1 = extension_bundle_1.Json.asObjectValue(result.value);
            assert(v1);
            assert.deepStrictEqual(v1.propertyNames, ["name"]);
            const v2 = extension_bundle_1.Json.asStringValue(v1.getPropertyValue("name"));
            assert(v2);
            assert.deepStrictEqual(v2.span, new extension_bundle_1.Language.Span(10, 5));
            assert.deepStrictEqual(v2.toString(), "Dan");
        });
        test("with object with one string property and one number property", () => {
            let result = extension_bundle_1.Json.parse("{ 'a': 'A', 'b': 30 }");
            assert.deepStrictEqual(9, result.tokenCount);
            assert.deepStrictEqual([21], result.lineLengths);
            const top = extension_bundle_1.Json.asObjectValue(result.value);
            assert(top);
            assert.deepStrictEqual(top.propertyNames, ["a", "b"]);
            const a = extension_bundle_1.Json.asStringValue(top.getPropertyValue("a"));
            assert(a);
            assert.deepStrictEqual(a.span, new extension_bundle_1.Language.Span(7, 3));
            assert.deepStrictEqual(a.toString(), "A");
            const b = extension_bundle_1.Json.asNumberValue(top.getPropertyValue("b"));
            assert(b);
            assert.deepStrictEqual(b.span, new extension_bundle_1.Language.Span(17, 2));
        });
        test("with object with one boolean property and one number property", () => {
            const result = extension_bundle_1.Json.parse("{ 'a': true, 'b': 30 }");
            assert.deepStrictEqual(9, result.tokenCount);
            assert.deepStrictEqual([22], result.lineLengths);
            const top = extension_bundle_1.Json.asObjectValue(result.value);
            assert(top);
            assert.deepStrictEqual(top.span, new extension_bundle_1.Language.Span(0, 22));
            assert.deepStrictEqual(top.propertyNames, ["a", "b"]);
            const a = extension_bundle_1.Json.asBooleanValue(top.getPropertyValue("a"));
            assert(a);
            assert.deepStrictEqual(a.span, new extension_bundle_1.Language.Span(7, 4));
            assert.deepStrictEqual(a.toBoolean(), true);
            const b = extension_bundle_1.Json.asNumberValue(top.getPropertyValue("b"));
            assert(b);
            assert.deepStrictEqual(b.span, new extension_bundle_1.Language.Span(18, 2));
        });
        test("with object with object property", () => {
            const result = extension_bundle_1.Json.parse("{ 'a': { 'b': 'B' } }");
            assert.deepStrictEqual(9, result.tokenCount);
            assert.deepStrictEqual([21], result.lineLengths);
            const top = extension_bundle_1.Json.asObjectValue(result.value);
            assert(top);
            assert.deepStrictEqual(top.span, new extension_bundle_1.Language.Span(0, 21));
            assert.deepStrictEqual(top.propertyNames, ["a"]);
            const a = extension_bundle_1.Json.asObjectValue(top.getPropertyValue("a"));
            assert(a);
            assert.deepStrictEqual(a.span, new extension_bundle_1.Language.Span(7, 12));
            assert.deepStrictEqual(a.propertyNames, ["b"]);
            const b = extension_bundle_1.Json.asStringValue(a.getPropertyValue("b"));
            assert(b);
            assert.deepStrictEqual(b.span, new extension_bundle_1.Language.Span(14, 3));
            assert.deepStrictEqual(b.toString(), "B");
        });
        test("with object with empty array property", () => {
            const result = extension_bundle_1.Json.parse("{ 'a': [] }");
            assert.deepStrictEqual(6, result.tokenCount);
            assert.deepStrictEqual([11], result.lineLengths);
            const top = extension_bundle_1.Json.asObjectValue(result.value);
            assert(top);
            assert.deepStrictEqual(top.propertyNames, ["a"]);
            const a = extension_bundle_1.Json.asArrayValue(top.getPropertyValue("a"));
            assert(a);
            assert.deepStrictEqual(a.length, 0);
        });
        test("with object with 1 element array property", () => {
            const result = extension_bundle_1.Json.parse("{ 'a': [ 'A' ] }");
            assert.deepStrictEqual(7, result.tokenCount);
            assert.deepStrictEqual([16], result.lineLengths);
            const top = extension_bundle_1.Json.asObjectValue(result.value);
            assert(top);
            assert.deepStrictEqual(top.span, new extension_bundle_1.Language.Span(0, 16));
            assert.deepStrictEqual(top.propertyNames, ["a"]);
            const a = extension_bundle_1.Json.asArrayValue(top.getPropertyValue("a"));
            assert(a);
            assert.deepStrictEqual(a.span, new extension_bundle_1.Language.Span(7, 7));
            assert.deepStrictEqual(a.length, 1);
            const a0 = extension_bundle_1.Json.asStringValue(a.elements[0]);
            assert(a0);
            assert.deepStrictEqual(a0.span, new extension_bundle_1.Language.Span(9, 3));
            assert.deepStrictEqual(a0.toString(), "A");
        });
        test("with object with 2 element array property", () => {
            const result = extension_bundle_1.Json.parse("{ 'a': [ 'A', 20 ] }");
            assert.deepStrictEqual(9, result.tokenCount);
            assert.deepStrictEqual([20], result.lineLengths);
            const top = extension_bundle_1.Json.asObjectValue(result.value);
            assert(top);
            assert.deepStrictEqual(top.span, new extension_bundle_1.Language.Span(0, 20));
            assert.deepStrictEqual(top.propertyNames, ["a"]);
            const a = extension_bundle_1.Json.asArrayValue(top.getPropertyValue("a"));
            assert(a);
            assert.deepStrictEqual(a.span, new extension_bundle_1.Language.Span(7, 11));
            assert.deepStrictEqual(a.length, 2);
            const a0 = extension_bundle_1.Json.asStringValue(a.elements[0]);
            assert(a0);
            assert.deepStrictEqual(a0.span, new extension_bundle_1.Language.Span(9, 3));
            assert.deepStrictEqual(a0.toString(), "A");
            const a1 = extension_bundle_1.Json.asNumberValue(a.elements[1]);
            assert(a1);
            assert.deepStrictEqual(a1.span, new extension_bundle_1.Language.Span(14, 2));
        });
        test("with array with literal and then quoted string elements without comma separator", () => {
            const result = extension_bundle_1.Json.parse("{ 'a': [ blah 'A' ] }");
            assert.deepStrictEqual(8, result.tokenCount);
            assert.deepStrictEqual([21], result.lineLengths);
            const top = extension_bundle_1.Json.asObjectValue(result.value);
            assert(top);
            assert.deepStrictEqual(top.span, new extension_bundle_1.Language.Span(0, 21));
            assert.deepStrictEqual(top.propertyNames, ["a"]);
            const a = extension_bundle_1.Json.asArrayValue(top.getPropertyValue("a"));
            assert(a);
            assert.deepStrictEqual(a.span, new extension_bundle_1.Language.Span(7, 12));
            assert.deepStrictEqual(a.length, 1);
            const a0 = extension_bundle_1.Json.asStringValue(a.elements[0]);
            assert(a0);
            assert.deepStrictEqual(a0.span, new extension_bundle_1.Language.Span(14, 3));
            assert.deepStrictEqual(a0.toString(), "A");
        });
        test("with array with literal and then quoted string elements with comma separator", () => {
            const result = extension_bundle_1.Json.parse("{ 'a': [ blah, 'A' ] }");
            assert.deepStrictEqual(9, result.tokenCount);
            assert.deepStrictEqual([22], result.lineLengths);
            const top = extension_bundle_1.Json.asObjectValue(result.value);
            assert(top);
            assert.deepStrictEqual(top.span, new extension_bundle_1.Language.Span(0, 22));
            assert.deepStrictEqual(top.propertyNames, ["a"]);
            const a = extension_bundle_1.Json.asArrayValue(top.getPropertyValue("a"));
            assert(a);
            assert.deepStrictEqual(a.span, new extension_bundle_1.Language.Span(7, 13));
            assert.deepStrictEqual(a.length, 1);
            const a0 = extension_bundle_1.Json.asStringValue(a.elements[0]);
            assert(a0);
            assert.deepStrictEqual(a0.span, new extension_bundle_1.Language.Span(15, 3));
            assert.deepStrictEqual(a0.toString(), "A");
        });
    });
    suite("Tokenizer", () => {
        suite("next()", () => {
            function nextTest(text, expectedTokens) {
                if (!expectedTokens) {
                    expectedTokens = [];
                }
                else if (expectedTokens instanceof extension_bundle_1.Json.Token) {
                    expectedTokens = [expectedTokens];
                }
                test(`with ${extension_bundle_1.Utilities.escapeAndQuote(text)}`, () => {
                    const tokenizer = new extension_bundle_1.Json.Tokenizer(text);
                    for (const expectedToken of expectedTokens) {
                        assert.deepStrictEqual(tokenizer.moveNext(), true, "Expected next() to be true");
                        assert.deepStrictEqual(tokenizer.hasStarted(), true, "Expected hasStarted() to be true");
                        assert.deepStrictEqual(tokenizer.current, expectedToken);
                    }
                    for (let i = 0; i < 2; ++i) {
                        assert.deepStrictEqual(tokenizer.moveNext(), false, "Expected next() to be false");
                        assert.deepStrictEqual(tokenizer.hasStarted(), true, "Expected hasStarted() to be true (after all expected tokens)");
                        assert.deepStrictEqual(tokenizer.current, null, "Expected current to be null");
                    }
                });
            }
            nextTest(null);
            nextTest(undefined);
            nextTest("");
            nextTest("{", extension_bundle_1.Json.LeftCurlyBracket(0));
            nextTest("}", extension_bundle_1.Json.RightCurlyBracket(0));
            nextTest("[", extension_bundle_1.Json.LeftSquareBracket(0));
            nextTest("]", extension_bundle_1.Json.RightSquareBracket(0));
            nextTest(",", extension_bundle_1.Json.Comma(0));
            nextTest(":", extension_bundle_1.Json.Colon(0));
            function nextTestWithWhitespace(whitespaceText) {
                nextTest(whitespaceText, parseWhitespace(whitespaceText));
            }
            nextTestWithWhitespace(" ");
            nextTestWithWhitespace("  ");
            nextTestWithWhitespace("\t");
            nextTestWithWhitespace("\r");
            nextTestWithWhitespace("\r\n");
            nextTestWithWhitespace(" \r\n\t");
            function nextTestWithQuotedString(quotedStringText) {
                nextTest(quotedStringText, parseQuotedString(quotedStringText));
            }
            nextTestWithQuotedString(`'`);
            nextTestWithQuotedString(`''`);
            nextTestWithQuotedString(`"`);
            nextTestWithQuotedString(`""`);
            nextTestWithQuotedString(`"hello`);
            nextTestWithQuotedString(`'hello`);
            nextTestWithQuotedString(`"C:\\\\Users\\\\"`);
            nextTestWithQuotedString(`"hello\\"there"`);
            //
            nextTest("{}", [
                extension_bundle_1.Json.LeftCurlyBracket(0),
                extension_bundle_1.Json.RightCurlyBracket(1)
            ]);
            nextTest("{ }", [
                extension_bundle_1.Json.LeftCurlyBracket(0),
                parseWhitespace(" ", 1),
                extension_bundle_1.Json.RightCurlyBracket(2)
            ]);
            nextTest("[]", [
                extension_bundle_1.Json.LeftSquareBracket(0),
                extension_bundle_1.Json.RightSquareBracket(1)
            ]);
            nextTest("[ ]", [
                extension_bundle_1.Json.LeftSquareBracket(0),
                parseWhitespace(" ", 1),
                extension_bundle_1.Json.RightSquareBracket(2)
            ]);
            function nextTestWithNumber(numberText) {
                nextTest(numberText, parseNumber(numberText));
            }
            nextTestWithNumber("0");
            nextTestWithNumber("123");
            nextTestWithNumber("7.");
            nextTestWithNumber("7.8");
            nextTestWithNumber("1e");
            nextTestWithNumber("1e5");
            nextTestWithNumber("1e-");
            nextTestWithNumber("1e+");
            nextTestWithNumber("1e+5");
            nextTestWithNumber("-");
            nextTestWithNumber("-456");
            nextTest("-a", [parseNumber("-"), parseLiteral("a", 1)]);
            nextTest(`{ 'name': 'test' }`, [
                extension_bundle_1.Json.LeftCurlyBracket(0),
                parseWhitespace(" ", 1),
                parseQuotedString(`'name'`, 2),
                extension_bundle_1.Json.Colon(8),
                parseWhitespace(" ", 9),
                parseQuotedString(`'test'`, 10),
                parseWhitespace(" ", 16),
                extension_bundle_1.Json.RightCurlyBracket(17)
            ]);
            nextTest(`{ 'name': 'te\\'st' }`, [
                extension_bundle_1.Json.LeftCurlyBracket(0),
                parseWhitespace(" ", 1),
                parseQuotedString("'name'", 2),
                extension_bundle_1.Json.Colon(8),
                parseWhitespace(" ", 9),
                parseQuotedString(`'te\\'st'`, 10),
                parseWhitespace(" ", 18),
                extension_bundle_1.Json.RightCurlyBracket(19)
            ]);
            nextTest(`{ 'a': 1, 'b': -2.3 }`, [
                extension_bundle_1.Json.LeftCurlyBracket(0),
                parseWhitespace(" ", 1),
                parseQuotedString("'a'", 2),
                extension_bundle_1.Json.Colon(5),
                parseWhitespace(" ", 6),
                parseNumber("1", 7),
                extension_bundle_1.Json.Comma(8),
                parseWhitespace(" ", 9),
                parseQuotedString("'b'", 10),
                extension_bundle_1.Json.Colon(13),
                parseWhitespace(" ", 14),
                parseNumber("-2.3", 15),
                parseWhitespace(" ", 19),
                extension_bundle_1.Json.RightCurlyBracket(20)
            ]);
            nextTest(`  [ { 'name': 'hello' }]`, [
                parseWhitespace("  ", 0),
                extension_bundle_1.Json.LeftSquareBracket(2),
                parseWhitespace(" ", 3),
                extension_bundle_1.Json.LeftCurlyBracket(4),
                parseWhitespace(" ", 5),
                parseQuotedString(`'name'`, 6),
                extension_bundle_1.Json.Colon(12),
                parseWhitespace(" ", 13),
                parseQuotedString(`'hello'`, 14),
                parseWhitespace(" ", 21),
                extension_bundle_1.Json.RightCurlyBracket(22),
                extension_bundle_1.Json.RightSquareBracket(23)
            ]);
            nextTest("true", parseBoolean("true"));
            nextTest(". hello there", [
                parseUnrecognized("."),
                parseWhitespace(" ", 1),
                parseLiteral("hello", 2),
                parseWhitespace(" ", 7),
                parseLiteral("there", 8)
            ]);
            nextTest(".[]82348923", [
                parseUnrecognized(".", 0),
                extension_bundle_1.Json.LeftSquareBracket(1),
                extension_bundle_1.Json.RightSquareBracket(2),
                parseNumber("82348923", 3)
            ]);
            nextTest(".[]82348923asdglih", [
                parseUnrecognized(".", 0),
                extension_bundle_1.Json.LeftSquareBracket(1),
                extension_bundle_1.Json.RightSquareBracket(2),
                parseNumber("82348923", 3),
                parseLiteral("asdglih", 11)
            ]);
            nextTest(".[]82348923asdglih   asl .,", [
                parseUnrecognized(".", 0),
                extension_bundle_1.Json.LeftSquareBracket(1),
                extension_bundle_1.Json.RightSquareBracket(2),
                parseNumber("82348923", 3),
                parseLiteral("asdglih", 11),
                parseWhitespace("   ", 18),
                parseLiteral("asl", 21),
                parseWhitespace(" ", 24),
                parseUnrecognized(".", 25),
                extension_bundle_1.Json.Comma(26)
            ]);
            nextTest(".[]82348923asdglih   asl .,'", [
                parseUnrecognized(".", 0),
                extension_bundle_1.Json.LeftSquareBracket(1),
                extension_bundle_1.Json.RightSquareBracket(2),
                parseNumber("82348923", 3),
                parseLiteral("asdglih", 11),
                parseWhitespace("   ", 18),
                parseLiteral("asl", 21),
                parseWhitespace(" ", 24),
                parseUnrecognized(".", 25),
                extension_bundle_1.Json.Comma(26),
                parseQuotedString(`'`, 27)
            ]);
            nextTest("/", parseLiteral("/"));
            nextTest("//", parseComment("//"));
            nextTest("// Hello there!", parseComment("// Hello there!"));
            nextTest("// Hello there!\n50", [
                parseComment("// Hello there!"),
                parseWhitespace("\n", 15),
                parseNumber("50", 16)
            ]);
            nextTest("/*", parseComment("/*"));
            nextTest("/* *", parseComment("/* *"));
            nextTest("/* \n blah", parseComment("/* \n blah"));
            nextTest("/* \n * blah */ test", [
                parseComment("/* \n * blah */"),
                parseWhitespace(" ", 14),
                parseLiteral("test", 15)
            ]);
            nextTest("/a", [
                parseLiteral("/", 0),
                parseLiteral("a", 1)
            ]);
            nextTest("hello_there", parseLiteral("hello_there"));
        });
    });
    suite("LeftCurlyBracket()", () => {
        function leftCurlyBracketTest(startIndex) {
            test(`with ${startIndex} startIndex`, () => {
                const t = extension_bundle_1.Json.LeftCurlyBracket(startIndex);
                assert.deepStrictEqual(t.type, extension_bundle_1.Json.TokenType.LeftCurlyBracket);
                assert.deepStrictEqual(t.span, new extension_bundle_1.Language.Span(startIndex, 1));
                assert.deepStrictEqual(t.toString(), "{");
            });
        }
        leftCurlyBracketTest(-1);
        leftCurlyBracketTest(0);
        leftCurlyBracketTest(7);
    });
    suite("RightCurlyBracket()", () => {
        function rightCurlyBracketTest(startIndex) {
            test(`with ${startIndex} startIndex`, () => {
                const t = extension_bundle_1.Json.RightCurlyBracket(startIndex);
                assert.deepStrictEqual(t.type, extension_bundle_1.Json.TokenType.RightCurlyBracket);
                assert.deepStrictEqual(t.span, new extension_bundle_1.Language.Span(startIndex, 1));
                assert.deepStrictEqual(t.toString(), "}");
            });
        }
        rightCurlyBracketTest(-1);
        rightCurlyBracketTest(0);
        rightCurlyBracketTest(7);
    });
    suite("LeftSquareBracket()", () => {
        function leftSquareBracketTest(startIndex) {
            test(`with ${startIndex} startIndex`, () => {
                const t = extension_bundle_1.Json.LeftSquareBracket(startIndex);
                assert.deepStrictEqual(t.type, extension_bundle_1.Json.TokenType.LeftSquareBracket);
                assert.deepStrictEqual(t.span, new extension_bundle_1.Language.Span(startIndex, 1));
                assert.deepStrictEqual(t.toString(), "[");
            });
        }
        leftSquareBracketTest(-1);
        leftSquareBracketTest(0);
        leftSquareBracketTest(7);
    });
    suite("RightSquareBracket()", () => {
        function rightSquareBracketTest(startIndex) {
            test(`with ${startIndex} startIndex`, () => {
                const t = extension_bundle_1.Json.RightSquareBracket(startIndex);
                assert.deepStrictEqual(t.type, extension_bundle_1.Json.TokenType.RightSquareBracket);
                assert.deepStrictEqual(t.span, new extension_bundle_1.Language.Span(startIndex, 1));
                assert.deepStrictEqual(t.toString(), "]");
            });
        }
        rightSquareBracketTest(-1);
        rightSquareBracketTest(0);
        rightSquareBracketTest(7);
    });
    suite("Comma()", () => {
        function commaTest(startIndex) {
            test(`with ${startIndex} startIndex`, () => {
                const t = extension_bundle_1.Json.Comma(startIndex);
                assert.deepStrictEqual(t.type, extension_bundle_1.Json.TokenType.Comma);
                assert.deepStrictEqual(t.span, new extension_bundle_1.Language.Span(startIndex, 1));
                assert.deepStrictEqual(t.toString(), ",");
            });
        }
        commaTest(-1);
        commaTest(0);
        commaTest(7);
    });
    suite("Colon()", () => {
        function colonTest(startIndex) {
            test(`with ${startIndex} startIndex`, () => {
                const t = extension_bundle_1.Json.Colon(startIndex);
                assert.deepStrictEqual(t.type, extension_bundle_1.Json.TokenType.Colon);
                assert.deepStrictEqual(t.span, new extension_bundle_1.Language.Span(startIndex, 1));
                assert.deepStrictEqual(t.toString(), ":");
            });
        }
        colonTest(-1);
        colonTest(0);
        colonTest(7);
    });
});
//# sourceMappingURL=JSON.test.js.map