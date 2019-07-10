/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-func-body-length no-console cyclomatic-complexity max-line-length
// Turn on to overwrite results files rather than creating new ".txt.actual" files when there are differences.
const OVERWRITE = true;
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const vscode_1 = require("vscode");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
const tleGrammarSourcePath = path.join(__dirname, '../../../grammars/arm-expression-string.tmLanguage.json');
// E.g., change keyword.other.expression.begin.arm-deployment => {{scope-expression-start}}, according to the preprocess section of the grammar
const tabSize = 20;
let unpreprocess;
function unpreprocessScopes(scopes) {
    if (!unpreprocess) {
        let source = fs.readFileSync(tleGrammarSourcePath).toString();
        let grammar = JSON.parse(source);
        let preprocess = grammar.preprocess || {};
        unpreprocess = [];
        for (let key of Object.getOwnPropertyNames(preprocess)) {
            if (key.startsWith("scope-")) {
                let value = preprocess[key];
                unpreprocess.push([new RegExp(value.replace('.', '\\.'), "g"), `{{${key}}}`]);
            }
        }
    }
    unpreprocess.forEach(entry => {
        let [regex, replacement] = entry;
        scopes = scopes.replace(regex, replacement);
    });
    return scopes;
}
let longestTestDuration = 0;
function assertUnchangedTokens(testPath, resultPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let start = Date.now();
        try {
            let doc = yield vscode_1.workspace.openTextDocument(testPath);
            let languageId = doc.languageId;
            let rawData = yield vscode_1.commands.executeCommand('_workbench.captureSyntaxTokens', vscode_1.Uri.file(testPath));
            // Let's use more reasonable property names in our data
            let data = rawData.map(d => ({ text: d.c.trim(), scopes: d.t, colors: d.r }))
                .filter(d => d.text !== "");
            let expectedLanguageId = testPath.endsWith('.json') ? 'json' : 'jsonc';
            if (languageId !== expectedLanguageId) {
                throw new Error(`File ${testPath} is getting opened in vscode using language ID '${languageId}' instead of the expected ID '${expectedLanguageId}'.`
                    + ' Check if your user settings have modified the default file.associations setting.');
            }
            vscode_1.commands.executeCommand('workbench.action.closeActiveEditor');
            let testCases;
            // If the test filename contains ".invalid.", then all testcases in it should have at least one "invalid" token.
            // Otherwise they should contain none.
            let shouldHaveInvalidTokens = !!testPath.match(/\.INVALID\./i);
            // If the test filename contains ".not-arm.", then all testcases in it should not contain any arm-deployment tokens.
            // Otherwise they should have at least one.
            let shouldBeArmTemplate = !testPath.match(/\.NOT-ARM\./i);
            let shouldBeExpression = shouldBeArmTemplate && !testPath.match(/\.NOT-EXPR\./i);
            // If the test contains code like this:
            //
            //   "$TEST{xxx}": <test1-text>",
            //   "$TEST{yyy}": <test2-text>"
            //   ...
            // }
            // then only the data for <test1..n-text> will be put into the results file
            const testStartToken = /^\$TEST/;
            for (let iData = 0; iData < data.length; ++iData) {
                // Extract the tokens before the test string
                let nBegin = data.findIndex((t, i) => i >= iData && t.text.match(testStartToken) !== null);
                if (nBegin < 0) {
                    break;
                }
                // Skip past the dictionary key
                let dictionaryNestingLevel = getDictionaryNestingLevel(data[nBegin].scopes);
                while (getDictionaryNestingLevel(data[nBegin].scopes) === dictionaryNestingLevel) {
                    nBegin++;
                }
                // Skip past the ":" and any whitespace
                assert(data[nBegin].text === ':');
                nBegin++;
                if (data[nBegin].text === ' ') {
                    nBegin++;
                }
                // Find the end of the test data - after the dictionary value
                let nEnd = data.findIndex((t, i) => i >= nBegin &&
                    // end of the dictionary value item
                    getDictionaryNestingLevel(t.scopes) === dictionaryNestingLevel);
                if (nEnd < 0) {
                    let { fullString, text } = getTestcaseResults([{ testString: '', data: data.slice(nBegin) }]);
                    assert(false, `Couldn't find end of test string starting here:\\n${text}\n${fullString}`);
                }
                nEnd -= 1;
                // Remove the last item if it's comma or }
                if (data[nEnd].text === ',' || data[nEnd].text === '}') {
                    --nEnd;
                }
                assert(nEnd >= nBegin);
                if (testCases === undefined) {
                    testCases = [];
                }
                let testData = data.slice(nBegin, nEnd + 1);
                let testcase = { testString: `TEST STRING: ${testData.map(d => d.text).join("")}`, data: testData };
                testCases.push(testcase);
                // Skip to look for next set of data
                iData = nEnd;
            }
            // If no individual testcases found, the whole file is a single testcase
            testCases = testCases || [{ data }];
            let { results: testcaseResults, fullString: resultsFullString } = getTestcaseResults(testCases);
            resultsFullString = normalize(resultsFullString.trim());
            let actualResultPath = `${resultPath}.actual`;
            let resultPathToWriteTo = OVERWRITE ? resultPath : actualResultPath;
            let removeActualResultPath = false;
            if (fs.existsSync(resultPath)) {
                let previousResult = normalize(fs.readFileSync(resultPath).toString().trim());
                let isJustDiff = false;
                try {
                    for (let testcaseResult of testcaseResults) {
                        if (shouldHaveInvalidTokens) {
                            assert(testcaseResult.includes('invalid.illegal'), "This test's filename contains '.INVALID.', and so should have had at least one invalid token in each testcase result.");
                        }
                        else {
                            assert(!testcaseResult.includes('invalid.illegal'), "This test's filename does not contain '.INVALID.', but at least one testcase in it contains an invalid token.");
                        }
                        if (shouldBeArmTemplate) {
                            assert(testcaseResult.includes('arm-deployment'), 
                            // tslint:disable-next-line: max-line-length
                            "This test's filename does not contain '.NOT-ARM.', and so every testcase in it should contain at least one arm-deployment token.");
                        }
                        else {
                            assert(!testcaseResult.includes('arm-deployment'), "This test's filename contains '.NOT-ARM.', but at least one testcase in it contains an arm-deployment token.");
                        }
                        let isExpression = testcaseResult.includes('meta.expression.tle.arm');
                        if (shouldBeExpression) {
                            assert(isExpression, 
                            // tslint:disable-next-line: max-line-length
                            "This test's filename does not contain '.NOT-EXPR.', and so every testcase in it should be an ARM expression.");
                        }
                        else {
                            assert(!isExpression, "This test's filename contains '.NOT-EXPR.', but at least one testcase in it contains an ARM expression.");
                        }
                    }
                    isJustDiff = true;
                    assert.equal(resultsFullString, previousResult);
                    removeActualResultPath = true;
                }
                catch (e) {
                    let nonDiffError = isJustDiff ? "" : `${vscode_azureextensionui_1.parseError(e).message}${os.EOL}`;
                    fs.writeFileSync(resultPathToWriteTo, resultsFullString, { flag: 'w' });
                    if (OVERWRITE) {
                        removeActualResultPath = true;
                        // tslint:disable-next-line: max-line-length
                        throw new Error(`${nonDiffError}*** MODIFIED THE RESULTS FILE (${resultPathToWriteTo}). VERIFY THE CHANGES BEFORE CHECKING IN!`);
                    }
                    else {
                        fs.writeFileSync(resultPathToWriteTo, resultsFullString, { flag: 'w' });
                        throw new Error(`${nonDiffError}*** ACTUAL RESULTS ARE IN (${resultPathToWriteTo}).`);
                    }
                }
            }
            else {
                fs.writeFileSync(resultPathToWriteTo, resultsFullString);
                removeActualResultPath = true;
                throw new Error(`*** NEW RESULTS FILE ${resultPathToWriteTo}`);
            }
            if (removeActualResultPath && fs.existsSync(actualResultPath)) {
                fs.unlinkSync(actualResultPath);
            }
        }
        finally {
            let stop = Date.now();
            let duration = stop - start;
            console.log(`Test duration: ${duration}`);
            if (duration > longestTestDuration) {
                longestTestDuration = duration;
            }
        }
    });
}
function getDictionaryNestingLevel(scopes) {
    let matches = scopes.match(/meta\.structure\.dictionary\.value/g);
    return matches ? matches.length : 0;
}
function normalize(s) {
    return s.replace(/(\r\n)|\r/g, os.EOL);
}
function getTestcaseResults(testCases) {
    let results = testCases.map((testcase) => {
        let prefix = testcase.testString ? `${testcase.testString}${os.EOL}` : "";
        let testCaseString = testcase.data.map(td => {
            let theText = td.text.trim();
            let padding = tabSize - theText.length;
            let scopes = unpreprocessScopes(td.scopes);
            if (padding > 0) {
                return `${theText}${" ".repeat(padding)}${scopes}`;
            }
            else {
                return `${theText}${os.EOL}${" ".repeat(tabSize)}${scopes}`;
            }
        }).join(os.EOL);
        return prefix + testCaseString;
    });
    let fullString = results.join(`${os.EOL}${os.EOL}`);
    fullString = normalize(`${fullString.trim()}${os.EOL}`);
    let text = normalize(testCases.map(tc => tc.data).map((tis) => tis.map(ti => ti.text).join('')).join(''));
    return { text, results, fullString };
}
suite('TLE colorization', function () {
    this.timeout(20000); // I've seen as high as 13s on server, although most are much shorter
    let testFolder = path.join(__dirname, '..', '..', '..', 'test', 'colorization', 'inputs');
    let resultsFolder = path.join(__dirname, '..', '..', '..', 'test', 'colorization', 'results');
    let testFiles;
    let resultFiles;
    if (!fs.existsSync(testFolder)) {
        throw new Error(`Can't find colorization tests folder ${testFolder}`);
    }
    if (!fs.existsSync(resultsFolder)) {
        fs.mkdirSync(resultsFolder);
    }
    testFiles = fs.readdirSync(testFolder);
    assert(testFiles.length, `Couldn't find any test files in ${testFolder}`);
    resultFiles = fs.readdirSync(resultsFolder);
    for (let resultFile of resultFiles) {
        if (resultFile.endsWith('.actual')) {
            fs.unlinkSync(path.join(resultsFolder, resultFile));
        }
    }
    resultFiles = fs.readdirSync(resultsFolder);
    let testToResultFileMap = new Map();
    let orphanedResultFiles = new Set(resultFiles);
    testFiles.forEach(testFile => {
        let resultFile = `${path.basename(testFile)}.txt`;
        testToResultFileMap.set(testFile, resultFile);
        orphanedResultFiles.delete(resultFile);
    });
    orphanedResultFiles.forEach(orphanedFile => {
        test(`ORPHANED: ${orphanedFile}`, () => { throw new Error(`Orphaned result file ${orphanedFile}`); });
    });
    testFiles.forEach(testFile => {
        if (testFile.startsWith('TODO')) {
            test(testFile);
        }
        else {
            test(testFile, () => __awaiter(this, void 0, void 0, function* () {
                yield assertUnchangedTokens(path.join(testFolder, testFile), path.join(resultsFolder, testToResultFileMap.get(testFile)));
            }));
        }
    });
    test("Check longest test duration", () => {
        console.log(`Longest colorization test duration: ${longestTestDuration / 1000}s`);
    });
});
//# sourceMappingURL=tle-colorization.test.js.map