/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Diagnostic, Range, Uri } from "vscode";
import { callWithTelemetryAndErrorHandling } from "vscode-azureextensionui";
import { validationDiagnosticsSource } from "./constants";
import { DeploymentTemplate } from "./DeploymentTemplate";
import * as Json from "./JSON";
import { Contains } from "./Language";
import { getVSCodeRangeFromSpan } from "./util/vscodePosition";

/**
 * Modifies the diagnostics that are returned from the backend template validation
 * @param getTemplate A function to retrieve the deployment template for the given URI
 */
export async function adjustValidationDiagnostics(documentUri: Uri, diagnostics: Diagnostic[], getTemplate: (uri: Uri) => Promise<DeploymentTemplate | undefined>): Promise<void> {
    for (let d of diagnostics) {
        if (d.source === validationDiagnosticsSource) {
            const newRange = await adjustRangeForValidationDiagnostic(documentUri, d, getTemplate);
            if (newRange) {
                d.range = newRange;
            }
        }
    }
}

async function adjustRangeForValidationDiagnostic(
    documentUri: Uri,
    diagnostic: Diagnostic,
    getTemplate: (uri: Uri) => Promise<DeploymentTemplate | undefined>
): Promise<Range | undefined> {
    return await callWithTelemetryAndErrorHandling('adjustRangeForValidationDiagnostic', async actionContext => {
        actionContext.errorHandling.suppressDisplay = true;
        actionContext.telemetry.suppressIfSuccessful = true;
        const dt = await getTemplate(documentUri);
        if (dt) {
            const range = diagnostic.range;
            const startIndex = dt.getDocumentCharacterIndex(range.start.line, range.start.character);
            const endIndex = dt.getDocumentCharacterIndex(range.end.line, range.end.character);
            // If the diagnostic range is empty...
            if (startIndex === endIndex) {
                // Pick a more appropriate non-empty range, which will be more friendly to users
                let value = dt.getJSONValueAtDocumentCharacterIndex(startIndex, Contains.extended);
                if (value instanceof Json.Property) {
                    value = value.nameValue;
                }
                if (value) {
                    return getVSCodeRangeFromSpan(dt, value.span);
                }
            }
        }

        return undefined;
    });
}
