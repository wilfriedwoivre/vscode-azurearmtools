// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------

import { IActionContext } from "vscode-azureextensionui";

export function newActionContext(): IActionContext {
    return {
        telemetry: {
            properties: {},
            measurements: {}
        },
        errorHandling: {
            issueProperties: {}
        }
    };
}
