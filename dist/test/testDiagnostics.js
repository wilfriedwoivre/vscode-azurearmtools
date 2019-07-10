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
// Support for testing diagnostics in vscode
// tslint:disable:no-unused-expression no-console no-string-based-set-timeout
// tslint:disable:insecure-random max-func-body-length radix prefer-template
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const vscode_1 = require("vscode");
const extension_bundle_1 = require("../extension.bundle");
const diagnosticsTimeout = 20000;
const testFolder = path.join(__dirname, '..', '..', 'test', 'templates');
const schemaSource = ''; // Built-in schema errors
const jsonSource = 'json'; // Built-in JSON errors
exports.armToolsSource = extension_bundle_1.diagnosticsSource;
function testDiagnosticsDeferred(filePath, options, expected) {
    test(filePath);
}
exports.testDiagnosticsDeferred = testDiagnosticsDeferred;
function testDiagnosticsFromFile(filePath, options, expected) {
    test(`File ${filePath}`, () => __awaiter(this, void 0, void 0, function* () {
        let actual = yield getDiagnosticsForTemplate(filePath);
        let ignoreSources = options.ignoreSources || [];
        // For now, always ignore schema and JSON diagnostics because we don't know when they're fully published
        ignoreSources = ignoreSources.concat([jsonSource, schemaSource]);
        if (options.ignoreSources) {
            actual = actual.filter(d => !options.ignoreSources.includes(d.source));
        }
        compareDiagnostics(actual, expected, options);
    }));
}
exports.testDiagnosticsFromFile = testDiagnosticsFromFile;
function testDiagnostics(testName, json, options, expected) {
    test(testName, () => __awaiter(this, void 0, void 0, function* () {
        let actual = yield getDiagnosticsForTemplate(json);
        let ignoreSources = options.ignoreSources || [];
        // For now, always ignore schema and JSON diagnostics because we don't know when they're fully published
        ignoreSources = ignoreSources.concat([jsonSource, schemaSource]);
        if (options.ignoreSources) {
            actual = actual.filter(d => !options.ignoreSources.includes(d.source));
        }
        compareDiagnostics(actual, expected, options);
    }));
}
exports.testDiagnostics = testDiagnostics;
function getDiagnosticsForTemplate(templateContentsOrFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let templateContents;
        let filePath;
        let fileToDelete;
        if (typeof templateContentsOrFileName === 'string') {
            if (!!templateContentsOrFileName.match(/\.jsonc?$/)) {
                // It's a filename
                filePath = path.join(testFolder, templateContentsOrFileName);
            }
            else {
                templateContents = templateContentsOrFileName;
            }
        }
        else {
            if (!templateContentsOrFileName.$schema) {
                templateContentsOrFileName.$schema = "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#";
            }
            templateContents = JSON.stringify(templateContentsOrFileName, null, 2);
        }
        if (!filePath) {
            assert(typeof templateContents === 'string');
            let tempName = '';
            for (let i = 0; i < 10; ++i) {
                tempName += String.fromCharCode(64 + Math.random() * 26);
            }
            filePath = path.join(os.tmpdir(), `${tempName}.jsonc`);
            fs.writeFileSync(filePath, templateContents);
            fileToDelete = filePath;
        }
        let diagnostics;
        let dispose;
        let timer;
        // tslint:disable-next-line:typedef
        let diagnosticsPromise = new Promise((resolve, reject) => {
            timer = setTimeout(() => {
                reject(new Error('Waiting for diagnostics timed out. Last retrieved diagnostics: '
                    + (diagnostics ? diagnostics.map(d => d.message).join('\n') : "None")));
            }, diagnosticsTimeout);
            dispose = vscode_1.languages.onDidChangeDiagnostics(e => {
                if (e.uris.find(uri => uri.fsPath === doc.uri.fsPath)) {
                    diagnostics = vscode_1.languages.getDiagnostics(doc.uri);
                    if (diagnostics.find(d => d.message === extension_bundle_1.diagnosticsCompleteMessage)) {
                        resolve();
                    }
                }
            });
        });
        let doc = yield vscode_1.workspace.openTextDocument(filePath);
        yield vscode_1.window.showTextDocument(doc);
        yield diagnosticsPromise;
        assert(!!diagnostics);
        if (dispose) {
            dispose.dispose();
        }
        if (fileToDelete) {
            fs.unlinkSync(fileToDelete);
        }
        clearTimeout(timer);
        vscode_1.commands.executeCommand('workbench.action.closeActiveEditor');
        return diagnostics.filter(d => d.message !== extension_bundle_1.diagnosticsCompleteMessage);
    });
}
function diagnosticToString(diagnostic, options) {
    assert(diagnostic.code === '', `Expecting empty code for all diagnostics, instead found Code="${String(diagnostic.code)}" for "${diagnostic.message}"`);
    let severity;
    switch (diagnostic.severity) {
        case vscode_1.DiagnosticSeverity.Error:
            severity = "Error";
            break;
        case vscode_1.DiagnosticSeverity.Warning:
            severity = "Warning";
            break;
        case vscode_1.DiagnosticSeverity.Information:
            severity = "Information";
            break;
        case vscode_1.DiagnosticSeverity.Hint:
            severity = "Hint";
            break;
        default:
            assert.fail(`Expected severity ${diagnostic.severity}`);
            break;
    }
    let s = `${severity}: ${diagnostic.message} (${diagnostic.source})`;
    if (options.includeRange === true) {
        s += ` [${diagnostic.range.start.line},${diagnostic.range.start.character}`
            + `-${diagnostic.range.end.line},${diagnostic.range.end.character}]`;
    }
    return s;
}
function compareDiagnostics(actual, expected, options) {
    let actualAsStrings = actual.map(d => diagnosticToString(d, options));
    assert.deepStrictEqual(actualAsStrings, expected);
}
//# sourceMappingURL=testDiagnostics.js.map