// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ----------------------------------------------------------------------------

import * as language from "./Language";

/**
 * An issue with a function call that is not valid in the current context
 */
export class InvalidFunctionContextIssue extends language.Issue {
    constructor(span: language.Span, message: string) {
        super(span, message);
    }

    public translate(movement: number): InvalidFunctionContextIssue {
        return new InvalidFunctionContextIssue(this.span.translate(movement), this.message);
    }
}
