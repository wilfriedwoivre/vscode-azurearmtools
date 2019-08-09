// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------

// tslint:disable:no-suspicious-comment max-line-length // TODO:

import * as fse from 'fs-extra';
import * as path from 'path';
import { ExtensionContext, workspace } from 'vscode';
import { callWithTelemetryAndErrorHandlingSync, parseError, TelemetryProperties } from 'vscode-azureextensionui';
import { Message } from 'vscode-jsonrpc';
import { CloseAction, ErrorAction, ErrorHandler, LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient';
import { dotnetAcquire, ensureDotnetDependencies, initializeDotnetAcquire } from '../acquisition/dotnetAcquisition';
import { armDeploymentLanguageId } from '../constants';
import { ext } from '../extensionVariables';
import { armDeploymentDocumentSelector } from '../supported';

const languageServerName = 'ARM Language Server';
const languageServerFolderName = 'languageServerBin';
const languageServerDllName = 'Microsoft.ArmLanguageServer.dll';
let serverStartMs: number;
const languageServerErrorTelemId = 'Language Server Error';
const defaultTraceLevel = 'Warning';
const dotnetVersion = '2.2';

export async function startArmLanguageServer(context: ExtensionContext): Promise<void> {
    let dotnetExePath: string;
    let serverDllPath: string;

    await callWithTelemetryAndErrorHandlingSync('Find Language Server', () => {
        let serverDllPathSetting: string | undefined = workspace.getConfiguration('armTools').get<string | undefined>('languageServer.path');

        if (typeof serverDllPathSetting !== 'string' || serverDllPathSetting === '') {
            // armTools.languageServer.path not set - look for the files in their normal installed location under languageServerFolderName
            let serverFolderPath = context.asAbsolutePath(languageServerFolderName);
            serverDllPath = path.join(serverFolderPath, languageServerDllName);
            if (!fse.existsSync(serverFolderPath) || !fse.existsSync(serverDllPath)) {
                throw new Error(`Couldn't find the ARM language server at ${serverDllPath}, you may need to reinstall the extension.`);
            }

            serverDllPath = path.join(serverFolderPath, languageServerDllName);
        } else {
            serverDllPath = serverDllPathSetting;

            if (fse.statSync(serverDllPathSetting).isDirectory()) {
                serverDllPath = path.join(serverDllPathSetting, languageServerDllName);
            }

            if (!fse.existsSync(serverDllPath)) {
                throw new Error(`Couldn't find the ARM language server at ${serverDllPath}.  Please verify or remove your 'armTools.languageServer.path' setting.`);
            }
        }
    });

    await callWithTelemetryAndErrorHandlingSync('Acquire Dotnet', async () => {
        initializeDotnetAcquire(ext.context, ext.extensionId);

        dotnetExePath = await dotnetAcquire(dotnetVersion);
        if (!(await fse.pathExists(dotnetExePath)) || !(await fse.stat(dotnetExePath)).isFile) {
            throw new Error(`Unexpected path returned for .net core: ${dotnetExePath}`);
        }

        // Attempt to determine by running a .net app whether additional runtime dependencies are missing on the machine (Linux only),
        // and if necessary prompts the user whether to install them.

        await ensureDotnetDependencies(dotnetExePath,
            [
                serverDllPath,
                '--help'
            ]);
    });

    callWithTelemetryAndErrorHandlingSync('startArmLanguageClient', () => {
        // The server is implemented in .NET Core. We run it by calling 'dotnet' with the dll as an argument

        // These trace levels are available in the server:
        //   Trace
        //   Debug
        //   Information
        //   Warning
        //   Error
        //   Critical
        //   None
        let trace: string = workspace.getConfiguration('armTools').get<string>("languageServer.traceLevel") || defaultTraceLevel;

        let commonArgs = [
            serverDllPath,
            '--logLevel',
            trace
        ];

        if (workspace.getConfiguration('armTools').get<boolean>('languageServer.waitForDebugger', false) === true) {
            commonArgs.push('--wait-for-debugger');
        }
        if (ext.addCompletionDiagnostic) {
            // Forces the server to add a completion message to its diagnostics
            commonArgs.push('--verbose-diagnostics');
        }

        // If the extension is launched in debug mode then the debug server options are used
        // Otherwise the run options are used
        let serverOptions: ServerOptions = {
            run: { command: dotnetExePath, args: commonArgs, options: { shell: false } },
            debug: { command: dotnetExePath, args: commonArgs, options: { shell: false } },
        };

        // Options to control the language client
        let clientOptions: LanguageClientOptions = {
            documentSelector: armDeploymentDocumentSelector,
            // synchronize: { asdf
            //     // Synchronize the setting section 'languageServerExample' to the server
            //     // TODO: configurationSection: 'languageServerExampleTODO',
            //     fileEvents: workspace.createFileSystemWatcher('**/*.json')
            // },
            //asdf initializationFailedHandler
        };

        // Create the language client and start the client.
        ext.outputChannel.appendLine(`Starting ARM Language Server at ${serverDllPath}`);
        ext.outputChannel.appendLine(`Client options:\n${JSON.stringify(clientOptions, null, 2)}`);
        ext.outputChannel.appendLine(`Server options:\n${JSON.stringify(serverOptions, null, 2)}`);
        const client = new LanguageClient(armDeploymentLanguageId, languageServerName, serverOptions, clientOptions);

        let defaultHandler = client.createDefaultErrorHandler();
        client.clientOptions.errorHandler = new WrappedErrorHandler(defaultHandler);

        try {
            serverStartMs = Date.now();
            let disposable = client.start();
            // Push the disposable to the context's subscriptions so that the
            // client can be deactivated on extension deactivation
            context.subscriptions.push(disposable);
        } catch (error) {
            throw new Error(
                // tslint:disable-next-line: prefer-template
                `${languageServerName}: unexpectedly failed to start.\n\n` +
                parseError(error).message);
        }
    });
}

class WrappedErrorHandler implements ErrorHandler {
    constructor(private _handler: ErrorHandler) {
    }

    /**
     * An error has occurred while writing or reading from the connection.
     *
     * @param error - the error received
     * @param message - the message to be delivered to the server if known.
     * @param count - a count indicating how often an error is received. Will
     *  be reset if a message got successfully send or received.
     */
    public error(error: Error, message: Message | undefined, count: number): ErrorAction {
        let parsed = parseError(error);
        ext.reporter.sendTelemetryEvent(
            languageServerErrorTelemId,
            <TelemetryProperties>{
                error: parsed.errorType,
                errorMessage: parsed.message,
                result: "Failed",
                jsonrpcMessage: message ? message.jsonrpc : "",
                count: String(count),
                stack: parsed.stack
            },
            {
                secondsSinceStart: (Date.now() - serverStartMs) / 1000
            });

        return this._handler.error(error, message, count);
    }

    /**
     * The connection to the server got closed.
     */
    public closed(): CloseAction {
        ext.reporter.sendTelemetryEvent(
            languageServerErrorTelemId,
            <TelemetryProperties>{
                error: "Crashed",
                errorMessage: '(Language server crashed)',
                result: "Failed"
            },
            {
                secondsSinceStart: (Date.now() - serverStartMs) / 1000
            });

        return this._handler.closed();
    }
}
