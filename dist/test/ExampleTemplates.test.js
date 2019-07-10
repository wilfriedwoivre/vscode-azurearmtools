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
// tslint:disable:no-unused-expression max-func-body-length max-line-length
const assert = require("assert");
const extension_bundle_1 = require("../extension.bundle");
suite("Template tests", () => {
    suite("Functions metadata", () => {
        // Tests to verify given functions do not produce errors - can be used to add quick unit tests for new function metadata
        function verifyTemplateHasNoErrors(template) {
            return __awaiter(this, void 0, void 0, function* () {
                const dt = new extension_bundle_1.DeploymentTemplate(template, "id");
                const expectedErrors = [];
                let errors = yield dt.errors;
                assert.deepStrictEqual(errors, expectedErrors, "Expected no errors in template");
            });
        }
        test("listCallbackUrl", () => __awaiter(this, void 0, void 0, function* () {
            yield verifyTemplateHasNoErrors(`
            {
                "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                "contentVersion": "1.0.0.0",
                "parameters": {
                    "logicAppName": {
                        "type": "string"
                    }
                },
                "outputs": {
                    "WebHookURI": {
                        "type": "string",
                        "value": "[listCallbackURL(concat(resourceId('Microsoft.Logic/workflows/', parameters('logicAppName')), '/triggers/manual'), '2016-06-01').value]"
                    }
                }
            }
            `);
        }));
        test("listKeys", () => __awaiter(this, void 0, void 0, function* () {
            yield verifyTemplateHasNoErrors(`
            {
                "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                "contentVersion": "1.0.0.0",
                "parameters": {
                    "storageAccountName": {
                        "type": "string"
                    }
                },
                "resources": [
                  {
                    "name": "[parameters('storageAccountName')]",
                    "type": "Microsoft.Storage/storageAccounts",
                    "apiVersion": "2016-12-01",
                    "sku": {
                      "name": "Standard_LRS"
                    },
                    "kind": "Storage",
                    "location": "[resourceGroup().location]",
                    "tags": {},
                    "properties": {
                    }
                  }
                ],
                "outputs": {
                    "referenceOutput": {
                        "type": "object",
                        "value": "[listKeys(parameters('storageAccountName'), '2016-12-01')]"
                    }
                  }
              }
              `);
        }));
    });
});
//# sourceMappingURL=ExampleTemplates.test.js.map