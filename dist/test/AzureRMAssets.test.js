"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-func-body-length
const assert = require("assert");
const networkTest_test_1 = require("./networkTest.test");
const extension_bundle_1 = require("../extension.bundle");
suite("AzureRMAssets", () => {
    networkTest_test_1.networkTest("getFunctionMetadata()", () => __awaiter(this, void 0, void 0, function* () {
        const functionMetadataArray = (yield extension_bundle_1.AzureRMAssets.getFunctionsMetadata()).functionMetadata;
        assert(functionMetadataArray);
        assert(functionMetadataArray.length > 0, `Expected to get at least 1 function metadata, but got ${functionMetadataArray.length} instead.`);
    }));
    suite("FunctionMetadata", () => {
        test("constructor(string,string,string)", () => {
            const metadata = new extension_bundle_1.FunctionMetadata("a", "b", "c", 1, 2, []);
            assert.deepStrictEqual(metadata.name, "a");
            assert.deepStrictEqual(metadata.usage, "b");
            assert.deepStrictEqual(metadata.description, "c");
            assert.deepStrictEqual(metadata.minimumArguments, 1);
            assert.deepStrictEqual(metadata.maximumArguments, 2);
            assert.deepStrictEqual(metadata.returnValueMembers, []);
        });
        test("findByName", () => {
            const metadata = new extension_bundle_1.FunctionsMetadata([new extension_bundle_1.FunctionMetadata("hi", "", "", 0, 0, []), new extension_bundle_1.FunctionMetadata("MyFunction", "", "", 0, 0, [])]);
            assert.equal(metadata.findbyName("MyFunction").name, "MyFunction");
            assert.equal(metadata.findbyName("myfunction").name, "MyFunction");
            assert.equal(metadata.findbyName("MYFUNCTION").name, "MyFunction");
            assert.equal(metadata.findbyName("MyFunction2"), undefined);
        });
        test("findByPrefix", () => {
            const metadata = new extension_bundle_1.FunctionsMetadata([
                new extension_bundle_1.FunctionMetadata("One", "", "", 0, 0, []),
                new extension_bundle_1.FunctionMetadata("Onerous", "", "", 0, 0, []),
                new extension_bundle_1.FunctionMetadata("Two", "", "", 0, 0, [])
            ]);
            assert.deepStrictEqual(metadata.filterByPrefix("MyFunction"), []);
            assert.deepStrictEqual(metadata.filterByPrefix("On").map(meta => meta.name), ["One", "Onerous"]);
            assert.deepStrictEqual(metadata.filterByPrefix("on").map(meta => meta.name), ["One", "Onerous"]);
            assert.deepStrictEqual(metadata.filterByPrefix("ONE").map(meta => meta.name), ["One", "Onerous"]);
            assert.deepStrictEqual(metadata.filterByPrefix("Oner").map(meta => meta.name), ["Onerous"]);
            assert.deepStrictEqual(metadata.filterByPrefix("Onerous").map(meta => meta.name), ["Onerous"]);
            assert.deepStrictEqual(metadata.filterByPrefix("Onerousy"), []);
        });
        suite("parameters", () => {
            test("with no parameters in usage", () => {
                const metadata = new extension_bundle_1.FunctionMetadata("a", "a()", "description", 1, 2, []);
                assert.deepStrictEqual(metadata.parameters, []);
            });
            test("with one parameter in usage", () => {
                const metadata = new extension_bundle_1.FunctionMetadata("a", "a(b)", "description", 1, 2, []);
                assert.deepStrictEqual(metadata.parameters, ["b"]);
            });
            test("with two parameters in usage", () => {
                const metadata = new extension_bundle_1.FunctionMetadata("a", "a(b, c )", "description", 1, 2, []);
                assert.deepStrictEqual(metadata.parameters, ["b", "c"]);
            });
        });
        suite("fromString(string)", () => {
            test("with null", () => {
                assert.deepStrictEqual(extension_bundle_1.FunctionMetadata.fromString(null), []);
            });
            test("with undefined", () => {
                assert.deepStrictEqual(extension_bundle_1.FunctionMetadata.fromString(undefined), []);
            });
            test("with empty string", () => {
                assert.deepStrictEqual(extension_bundle_1.FunctionMetadata.fromString(""), []);
            });
            test("with non-JSON string", () => {
                assert.deepStrictEqual(extension_bundle_1.FunctionMetadata.fromString("hello there"), []);
            });
            test("with empty object", () => {
                assert.deepStrictEqual(extension_bundle_1.FunctionMetadata.fromString("{}"), []);
            });
            test("with empty functionSignatures property", () => {
                assert.deepStrictEqual(extension_bundle_1.FunctionMetadata.fromString("{ 'functionSignatures': [] }"), []);
            });
            test("with one function signature with only name property", () => {
                assert.deepStrictEqual(extension_bundle_1.FunctionMetadata.fromString(`{ "functionSignatures": [ { "name": "a", "expectedUsage": "z", "description": "1" } ] }`), [
                    new extension_bundle_1.FunctionMetadata("a", "z", "1", undefined, undefined, [])
                ]);
            });
            test("with two function signatures with only name property", () => {
                assert.deepStrictEqual(
                // tslint:disable-next-line:max-line-length
                extension_bundle_1.FunctionMetadata.fromString(`{ "functionSignatures": [ { "name": "a", "expectedUsage": "z" }, { "name": "b", "expectedUsage": "y", "description": "7" } ] }`), [
                    new extension_bundle_1.FunctionMetadata("a", "z", undefined, undefined, undefined, []),
                    new extension_bundle_1.FunctionMetadata("b", "y", "7", undefined, undefined, [])
                ]);
            });
            test("with actual ExpressionMetadata.json file contents", () => {
                const fileContents = `{
                "$schema": "expressionMetadata.schema.json",
                "functionSignatures": [
                    {
                    "name": "add",
                    "expectedUsage": "add(operand1, operand2)",
                    "minimumArguments": 2,
                    "maximumArguments": 2
                    },
                    {
                    "name": "base64",
                    "expectedUsage": "base64(inputString)",
                    "minimumArguments": 1,
                    "maximumArguments": 1
                    },
                    {
                    "name": "concat",
                    "expectedUsage": "concat(arg1, arg2, arg3, ...)",
                    "minimumArguments": 0,
                    "maximumArguments": null
                    },
                    {
                    "name": "copyIndex",
                    "expectedUsage": "copyIndex([offset])",
                    "minimumArguments": 0,
                    "maximumArguments": 1
                    },
                    {
                    "name": "deployment",
                    "expectedUsage": "deployment()",
                    "minimumArguments": 0,
                    "maximumArguments": 0
                    },
                    {
                    "name": "div",
                    "expectedUsage": "div(operand1, operand2)",
                    "minimumArguments": 2,
                    "maximumArguments": 2
                    },
                    {
                    "name": "int",
                    "expectedUsage": "int(valueToConvert)",
                    "minimumArguments": 1,
                    "maximumArguments": 1
                    },
                    {
                    "name": "length",
                    "expectedUsage": "length(array\/string)",
                    "minimumArguments": 1,
                    "maximumArguments": 1
                    },
                    {
                    "name": "listKeys",
                    "expectedUsage": "listKeys(resourceName\/resourceIdentifier, apiVersion)",
                    "minimumArguments": 2,
                    "maximumArguments": 2
                    },
                    {
                    "name": "listPackage",
                    "expectedUsage": "listPackage(resourceName\/resourceIdentifier, apiVersion)",
                    "minimumArguments": 2,
                    "maximumArguments": 2
                    },
                    {
                    "name": "mod",
                    "expectedUsage": "mod(operand1, operand2)",
                    "minimumArguments": 2,
                    "maximumArguments": 2
                    },
                    {
                    "name": "mul",
                    "expectedUsage": "mul(operand1, operand2)",
                    "minimumArguments": 2,
                    "maximumArguments": 2
                    },
                    {
                    "name": "padLeft",
                    "expectedUsage": "padLeft(stringToPad, totalLength, paddingCharacter)",
                    "minimumArguments": 3,
                    "maximumArguments": 3
                    },
                    {
                    "name": "parameters",
                    "expectedUsage": "parameters(parameterName)",
                    "minimumArguments": 1,
                    "maximumArguments": 1
                    },
                    {
                    "name": "providers",
                    "expectedUsage": "providers(providerNamespace, [resourceType])",
                    "minimumArguments": 1,
                    "maximumArguments": 2
                    },
                    {
                    "name": "reference",
                    "expectedUsage": "reference(resourceName\/resourceIdentifier, [apiVersion])",
                    "minimumArguments": 1,
                    "maximumArguments": 2
                    },
                    {
                    "name": "replace",
                    "expectedUsage": "replace(originalString, oldCharacter, newCharacter)",
                    "minimumArguments": 3,
                    "maximumArguments": 3
                    },
                    {
                    "name": "resourceGroup",
                    "expectedUsage": "resourceGroup()",
                    "minimumArguments": 0,
                    "maximumArguments": 0,
                    "returnValueMembers": [
                        { "name": "id" },
                        { "name": "name" },
                        { "name": "location" },
                        { "name": "properties" },
                        { "name": "tags" }
                    ]
                    },
                    {
                    "name": "resourceId",
                    "expectedUsage": "resourceId([subscriptionId], [resourceGroupName], resourceType, resourceName1, [resourceName2]...)",
                    "minimumArguments": 2,
                    "maximumArguments": null
                    },
                    {
                    "name": "split",
                    "expectedUsage": "split(inputString, delimiter)",
                    "minimumArguments": 2,
                    "maximumArguments": 2
                    },
                    {
                    "name": "string",
                    "expectedUsage": "string(valueToConvert)",
                    "minimumArguments": 1,
                    "maximumArguments": 1
                    },
                    {
                    "name": "sub",
                    "expectedUsage": "sub(operand1, operand2)",
                    "minimumArguments": 2,
                    "maximumArguments": 2
                    },
                    {
                    "name": "subscription",
                    "expectedUsage": "subscription()",
                    "minimumArguments": 0,
                    "maximumArguments": 0,
                    "returnValueMembers": [
                        { "name": "id" },
                        { "name": "subscriptionId" }
                    ]
                    },
                    {
                    "name": "substring",
                    "expectedUsage": "substring(stringToParse, startIndex, length)",
                    "minimumArguments": 1,
                    "maximumArguments": 3
                    },
                    {
                    "name": "toLower",
                    "expectedUsage": "toLower(string)",
                    "minimumArguments": 1,
                    "maximumArguments": 1
                    },
                    {
                    "name": "toUpper",
                    "expectedUsage": "toUpper(string)",
                    "minimumArguments": 1,
                    "maximumArguments": 1
                    },
                    {
                        "name": "trim",
                        "expectedUsage": "trim(stringToTrim)",
                        "minimumArguments": 1,
                        "maximumArguments": 1
                    },
                    {
                    "name": "uniqueString",
                    "expectedUsage": "uniqueString(stringForCreatingUniqueString, ...)",
                    "minimumArguments": 1,
                    "maximumArguments": null
                    },
                    {
                    "name": "uri",
                    "expectedUsage": "uri(baseUri, relativeUri)",
                    "minimumArguments": 2,
                    "maximumArguments": 2
                    },
                    {
                    "name": "variables",
                    "expectedUsage": "variables(variableName)",
                    "minimumArguments": 1,
                    "maximumArguments": 1
                    }
                ]
                }`;
                const functionMetadata = extension_bundle_1.FunctionMetadata.fromString(fileContents);
                assert(functionMetadata);
                assert(functionMetadata.length > 0);
            });
        });
    });
});
//# sourceMappingURL=AzureRMAssets.test.js.map