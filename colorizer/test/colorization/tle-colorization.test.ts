/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const OVERWRITE = false;

import { suite, test } from 'mocha';
import * as assert from 'assert';
import { commands, Uri } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface TokenInfo {
    text: string;
    scopes: string;
    colors: { [key: string]: string }[];
}

const tabSize = 20;

async function assertUnchangedTokens(testPath: string, resultPath: string): Promise<void> {
    let testContent = fs.readFileSync(testPath).toString();

    let rawData = <{ c: string; t: string; r: unknown[] }[]>await commands.executeCommand('_workbench.captureSyntaxTokens', Uri.file(testPath));

    // Let's use more reasonable property names in our data
    let data: TokenInfo[] = rawData.map(d => <TokenInfo>{ text: d.c, scopes: d.t, colors: d.r });

    // If the test contains code like this:
    //
    //   "$TEST": <test-text>"
    //
    // then only the data for <test-text> will be put into the results file
    const testStartToken: string = '$TEST';
    if (testContent.includes(testStartToken)) {
        // Extract the tokens before the test string
        let nBegin = data.findIndex(t => t.text === testStartToken);
        assert(nBegin >= 0, `Couldn't find token '${testStartToken}'`);
        // Skip past the end quote, colon and whitespace
        assert(data[nBegin + 1].text === '"');
        assert(data[nBegin + 2].text === ':');
        assert(data[nBegin + 3].text === ' ');
        nBegin += 4;

        // Find the end of the test data
        let nEnd = data.findIndex(t => t.text === '}' && t.scopes.includes('punctuation.definition.dictionary.end.json.comments'));
        assert(nEnd >= 0, "Couldn't find end of test string");
        nEnd -= 1;

        assert(nEnd >= nBegin);

        data = data.slice(nBegin, nEnd + 1);
    }

    let summary = data.map(d => {
        //let lastScope = d.scopes.split(' ').pop();
        let padding = tabSize - d.text.length;
        if (padding > 0) {
            return `${d.text}${" ".repeat(padding)}${d.scopes}`;
        } else {
            return `${d.text}\n${" ".repeat(tabSize)}${d.scopes}`;
        }
    }).join('\r');
    let newResult = summary;

    if (fs.existsSync(resultPath)) {
        let previousResult = fs.readFileSync(resultPath).toString();

        try {
            assert.equal(newResult, previousResult);
        } catch (e) {
            if (OVERWRITE) {
                fs.writeFileSync(resultPath, newResult, { flag: 'w' });
                throw new Error(`*** MODIFIED RESULTS FILE (${resultPath}). VERIFY THE CHANGES BEFORE CHECKING IN!\r\n${e.message ? e.message : e.toString()}`);
            } else {
                let newResultPath = resultPath + ".actual";
                fs.writeFileSync(newResultPath, newResult, { flag: 'w' });
                throw new Error(`*** ACTUAL RESULTS ARE IN (${newResultPath}).`);
            }
        }
    } else {
        fs.writeFileSync(resultPath, newResult);
        throw new Error(`*** NEW RESULTS FILE file://${resultPath}. VERIFY BEFORE CHECKING IN!`);
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
        test(orphanedFile, () => { throw new Error(`Orphaned result file ${orphanedFile}`); });
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
