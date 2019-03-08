// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------

import * as assert from "assert";
import { DeploymentTemplate } from "./DeploymentTemplate";
import { InvalidFunctionContextIssue } from "./InvalidFunctionContextIssue";
import * as Json from "./JSON";
import * as TLE from "./TLE";

export enum FunctionCallContext {
    InVarDefinition,

    InParamDefinitionDefValue,
    InParamDefinitionNotDefValue
}

export class FunctionCallContextCheckerJSONVisitor extends Json.Visitor {
    public readonly errors: InvalidFunctionContextIssue[] = [];

    constructor(private _deploymentTemplate: DeploymentTemplate, private _callContext: FunctionCallContext) {
        super();

        assert(_deploymentTemplate);
    }

    public visitStringValue(value: Json.StringValue): void {
        assert(value, "Cannot visit a null or undefined Json.StringValue.");

        const tleParseResult: TLE.ParseResult = this._deploymentTemplate.getTLEParseResultFromJSONStringValue(value);
        if (tleParseResult && tleParseResult.expression) {
            const tleVisitor = new FunctionCallContextCheckerTLEVisitor(this._callContext);
            tleParseResult.expression.accept(tleVisitor);

            const jsonValueStartIndex: number = value.startIndex;
            for (const tleError of tleVisitor.errors) {
                this.errors.push(tleError.translate(jsonValueStartIndex));
            }
        }
    }
}

class FunctionCallContextCheckerTLEVisitor extends TLE.Visitor {
    public readonly errors: InvalidFunctionContextIssue[] = [];

    constructor(private _callContext: FunctionCallContext) {
        super();
    }

    public visitFunction(functionValue: TLE.FunctionValue): void {
        let functionName: string | undefined = functionValue && functionValue.nameToken.stringValue;
        if (functionName) {
            if (functionName.toLowerCase() === "reference" && this._callContext === FunctionCallContext.InVarDefinition) {
                this.errors.push(new InvalidFunctionContextIssue(functionValue.nameToken.span, "reference() cannot be invoked inside of a variable definition."));
            }
            if (functionName.toLowerCase() === "newGuid" && this._callContext !== FunctionCallContext.InParamDefinitionDefValue) {
                this.errors.push(new InvalidFunctionContextIssue(functionValue.nameToken.span, "newGuid() can only be invoked inside of a parameter definition's defaultValue."));
            }
            if (functionName.toLowerCase() === "utcnow" && this._callContext !== FunctionCallContext.InParamDefinitionDefValue) {
                this.errors.push(new InvalidFunctionContextIssue(functionValue.nameToken.span, "utcnow() can only be invoked inside of a parameter definition's defaultValue."));
            }

            super.visitFunction(functionValue);
        }
    }
}
