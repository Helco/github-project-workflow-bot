import { IWorkflowContext } from ".";

interface ErrorBehaviourOpts {
    readonly shouldContinue: boolean;
    readonly shouldReport: boolean;
}
export class WorkflowActionErrorBehaviour implements ErrorBehaviourOpts {
    public readonly shouldContinue: boolean;
    public readonly shouldReport: boolean;

    private constructor(opts: ErrorBehaviourOpts) {
        this.shouldContinue = opts.shouldContinue;
        this.shouldReport = opts.shouldReport;
    }

    public static get Cancel() {
        return new WorkflowActionErrorBehaviour({
            shouldContinue: false,
            shouldReport: true
        });
    }

    public static get CancelSilently() {
        return new WorkflowActionErrorBehaviour({
            shouldContinue: false,
            shouldReport: false
        });
    }

    public static get Ignore() {
        return new WorkflowActionErrorBehaviour({
            shouldContinue: true,
            shouldReport: true
        });
    }
}

export interface IWorkflowAction {
    readonly debugName: string;
    readonly errorBehaviour : WorkflowActionErrorBehaviour;
    run(context: IWorkflowContext): Promise<void>;
}
