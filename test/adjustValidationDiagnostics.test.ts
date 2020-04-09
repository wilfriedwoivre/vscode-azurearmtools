// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------

// tslint:disable:object-literal-key-quotes

import { IDeploymentParametersFile, IDeploymentTemplate } from "./support/diagnostics";

suite("adjustValidationDiagnostics", () => {
    const paramsWithLocation: IDeploymentParametersFile = {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "location": {
                "value": "somewhere"
            }
        }
    };

    function createTest(
        name: string,
        // Template marked with a "!" where the error occurs, and <!start!> and <!end!> where the
        // adjusted error should be
        markedTemplate: IDeploymentTemplate | string,
        params?: IDeploymentParametersFile | string
    ): void {
        test(name);
    }

    createTest(
        "No parameters defined, one value given",
        {
            "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "resources": []
        },
        paramsWithLocation
    );
    createTest(
        "One parameter defined, three values given",
        {
            "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "resources": [],
            "parameters": {
                "p1": {
                    "type": "int"
                }
            }
        },
        {
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
                "location": {
                    "value": "somewhere"
                },
                "name": {
                    "value": "someone"
                },
                "p1": {
                    "value": "p1"
                }
            }
        });
});
