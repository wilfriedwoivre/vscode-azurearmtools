"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const testDiagnostics_1 = require("./testDiagnostics");
suite("Diagnostics functionality", () => {
    suite("ARM Tools", () => {
        testDiagnostics_1.testDiagnosticsFromFile('new-vm.jsonc', { includeRange: true }, [
            "Warning: The parameter 'backupVaultRGIsNew' is never used. (ARM Tools) [32,8-32,28]",
            "Warning: The parameter 'backupContainerName' is never used. (ARM Tools) [47,8-47,29]"
        ]);
        testDiagnostics_1.testDiagnosticsFromFile('errors.json', { includeRange: true }, [
            "Error: Undefined parameter reference: 'windowsOSVersion' (ARM Tools) [69,26-69,44]",
            "Error: Undefined variable reference: 'storageAccountType' (ARM Tools) [116,35-116,55]",
            "Warning: The parameter 'domainNamePrefix' is never used. (ARM Tools) [4,4-4,22]",
            "Warning: The variable 'osType' is never used. (ARM Tools) [66,4-66,12]",
        ]);
        testDiagnostics_1.testDiagnosticsDeferred('language-service-p0.template.json');
        testDiagnostics_1.testDiagnosticsDeferred('language-service-p2.template.json');
    }); // end suite ARM Tools
});
//# sourceMappingURL=diagnostics.test.js.map