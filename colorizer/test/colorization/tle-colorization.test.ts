/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

//Turn on temporarily to overwrite results files rather than creating new ".txt.actual" files when there are differences. Should normally leave this as false.
const OVERWRITE = false;

import { suite, test } from 'mocha';
import * as assert from 'assert';
import { commands, Uri } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface ITestcase {
    testString?: string;
    data: ITokenInfo[];
}

interface ITokenInfo {
    text: string;
    scopes: string;
    colors: { [key: string]: string }[];
}

const tabSize = 20;

async function assertUnchangedTokens(testPath: string, resultPath: string): Promise<void> {
    let rawData = <{ c: string; t: string; r: unknown[] }[]>await commands.executeCommand('_workbench.captureSyntaxTokens', Uri.file(testPath));

    // Let's use more reasonable property names in our data
    let data: ITokenInfo[] = rawData.map(d => <ITokenInfo>{ text: d.c, scopes: d.t, colors: d.r });
    let testCases: ITestcase[];

    let shouldHaveInvalidTokens = testPath.includes('.invalid.');

    // If the test contains code like this:
    //
    //   "$TEST": <test1-text>",
    //   "$TEST": <test2-text>"
    //   ...
    // }
    // then only the data for <test1..n-text> will be put into the results file
    const testStartToken: string = '$TEST';
    for (let iData = 0; iData < data.length; ++iData) {
        // Extract the tokens before the test string
        let nBegin = data.findIndex((t, i) => i >= iData && t.text === testStartToken);
        if (nBegin < 0) {
            break;
        }

        // Skip past the end quote, colon and whitespace
        assert(data[nBegin + 1].text === '"');
        assert(data[nBegin + 2].text === ':');
        assert(data[nBegin + 3].text === ' ');
        nBegin += 4;

        // Find the end of the test data - either } or ,
        let nEnd = data.findIndex((t, i) =>
            i >= nBegin &&
            (t.text === '}' && t.scopes.includes('punctuation.definition.dictionary.end.json')
                || (t.text === ',' && t.scopes.includes('punctuation.separator.dictionary.pair.json')
                )));
        assert(nEnd >= 0, "Couldn't find end of test string");
        nEnd -= 1;

        assert(nEnd >= nBegin);

        if (testCases === undefined) {
            testCases = [];
        }
        let testData = data.slice(nBegin, nEnd + 1);
        let testcase: ITestcase = { testString: `TEST STRING: ${testData.map(d => d.text).join("")}`, data: testData };
        testCases.push(testcase);

        // Skip to look for next set of data
        iData = nEnd;
    }

    // If no individual testcases found, the whole file is a single testcase
    testCases = testCases || [<ITestcase>{ data }];

    let newResult = testCases.map((testcase: ITestcase) => {
        let prefix = testcase.testString ? testcase.testString + "\n" : "";

        let testCaseString = testcase.data.map(td => {
            let padding = tabSize - td.text.length;
            let text = td.text;
            if (padding > 0) {
                return `${text}${" ".repeat(padding)}${td.scopes}`;
            } else {
                return `${text}\n${" ".repeat(tabSize)}${td.scopes}`;
            }
        }).join('\n');
        return prefix + testCaseString;
    }).join('\n\n');
    newResult = newResult.trimRight() + "\n";

    let actualResultPath = resultPath + ".actual";
    let resultPathToWriteTo = OVERWRITE ? resultPath : actualResultPath;
    let removeActualResultPath = false;
    if (fs.existsSync(resultPath)) {
        let previousResult = fs.readFileSync(resultPath).toString().trimRight().replace(/(\r\n)|\r/g, '\n');

        if (shouldHaveInvalidTokens) {
            assert(newResult.includes('invalid.illegal'), "This testcase filename includes 'invalid', and so should have had at least one invalid token in the result.");
        } else {
            assert(!newResult.includes('invalid.illegal'), "This testcase filename does not include 'invalid', but at least one invalid token was found in the result.");
        }

        try {
            assert.equal(newResult.trimRight(), previousResult.trimRight());
            removeActualResultPath = true;
        } catch (e) {
            fs.writeFileSync(resultPathToWriteTo, newResult, { flag: 'w' });

            if (OVERWRITE) {
                removeActualResultPath = true;
                throw new Error(`*** MODIFIED THE RESULTS FILE (${resultPathToWriteTo}). VERIFY THE CHANGES BEFORE CHECKING IN!\r\n${e.message ? e.message : e.toString()}`);
            } else {
                fs.writeFileSync(resultPathToWriteTo, newResult, { flag: 'w' });
                throw new Error(`*** ACTUAL RESULTS ARE IN (${resultPathToWriteTo}).`);
            }
        }
    } else {
        fs.writeFileSync(resultPathToWriteTo, newResult);
        removeActualResultPath = true;
        throw new Error(`*** NEW RESULTS FILE ${resultPathToWriteTo}`);
    }

    if (removeActualResultPath && fs.existsSync(actualResultPath)) {
        fs.unlinkSync(actualResultPath);
    }
}

suite('TLE colorization', () => {
    let testFolder = path.join(__dirname, '..', '..', '..', 'test', 'colorization', 'files');
    let resultsFolder = path.join(__dirname, '..', '..', '..', 'test', 'colorization', 'results');

    let testFiles: string[];
    let resultFiles: string[];

    if (!fs.existsSync(testFolder)) {
        throw new Error(`Can't find colorization tests folder ${testFolder}`);
    }
    if (!fs.existsSync(resultsFolder)) {
        fs.mkdirSync(resultsFolder);
    }

    testFiles = fs.readdirSync(testFolder);
    assert(testFiles.length, `Couldn't find any test files in ${testFolder}`);

    resultFiles = fs.readdirSync(resultsFolder);

    let testToResultFileMap = new Map<string, string>();
    let orphanedResultFiles = new Set<string>(resultFiles);
    testFiles.forEach(testFile => {
        let resultFile = path.basename(testFile) + '.txt';
        testToResultFileMap.set(testFile, resultFile);
        orphanedResultFiles.delete(resultFile);
    })

    orphanedResultFiles.forEach(orphanedFile => {
        test(`ORPHANED: ${orphanedFile}`, () => { throw new Error(`Orphaned result file ${orphanedFile}`); });
    });

    testFiles.forEach(testFile => {
        if (testFile.includes('TODO')) {
            test(testFile);
        } else {
            test(testFile, async (): Promise<void> => {
                await assertUnchangedTokens(path.join(testFolder, testFile), path.join(resultsFolder, testToResultFileMap.get(testFile)));
            });
        }
    });
});
