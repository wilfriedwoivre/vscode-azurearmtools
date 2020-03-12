/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DiagnosticRelatedInformation, Location, Position, Uri } from "vscode";
import { sources } from "../test/support/diagnostics";
import { IDiagnosticsHandler } from './languageclient/startArmLanguageServer';

export class ParameterDiagnosticsHandler implements IDiagnosticsHandler {
    public currentParameterFile: Uri | undefined;

    public handleDiagnostics(uri: Uri, diagnostics: import("vscode").Diagnostic[]): import("vscode").Diagnostic[] {
        if (this.currentParameterFile) {
            for (let diag of diagnostics) {
                if (diag.source === sources.template.name
                    && diag.message.includes('aka.ms/arm-deploy/#parameter-file')
                    && !diag.relatedInformation
                ) {
                    diag.relatedInformation = [];
                    diag.relatedInformation.push(
                        new DiagnosticRelatedInformation(
                            new Location(this.currentParameterFile, new Position(0, 0)),
                            "The error may have occurred in the parameter fle"
                        )
                    );
                }
            }
        }

        return diagnostics;
    }
}
