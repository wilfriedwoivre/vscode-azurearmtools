"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:promise-function-async no-implicit-dependencies
const dns = require("dns");
let internetConnected;
/**
 * Determine if the running application has internet connectivity.
 */
function hasInternetConnection() {
    if (internetConnected === undefined) {
        // tslint:disable-next-line:typedef
        internetConnected = new Promise((resolve, reject) => {
            dns.lookup("www.microsoft.com", (error, address, family) => {
                resolve(!error);
            });
        });
    }
    return internetConnected;
}
/**
 * A test that is dependant on internet connectivity. If the application is not currently connected
 * to the internet, then the test will be skipped.
 */
// tslint:disable-next-line:no-any
function networkTest(testName, testFunction) {
    test(testName, function () {
        this.timeout(10000);
        return hasInternetConnection()
            .then((connected) => {
            if (connected) {
                return testFunction();
            }
            else {
                return this.skip();
            }
        });
    });
}
exports.networkTest = networkTest;
//# sourceMappingURL=networkTest.test.js.map