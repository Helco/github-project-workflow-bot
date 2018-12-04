import { IWorkflowContext } from ".";

interface ErrorBehaviourOpts {
    readonly shouldContinue: boolean;
    readonly shouldReport: boolean;
}
export class WorkflowStepErrorBehaviour implements ErrorBehaviourOpts {
    public readonly shouldContinue: boolean;
    public readonly shouldReport: boolean;

    private constructor(opts: ErrorBehaviourOpts) {
        this.shouldContinue = opts.shouldContinue;
        this.shouldReport = opts.shouldReport;
    }

    public static get Cancel() {
        return new WorkflowStepErrorBehaviour({
            shouldContinue: false,
            shouldReport: true
        });
    }

    public static get CancelSilently() {
        return new WorkflowStepErrorBehaviour({
            shouldContinue: false,
            shouldReport: false
        });
    }

    public static get Ignore() {
        return new WorkflowStepErrorBehaviour({
            shouldContinue: true,
            shouldReport: true
        });
    }
}

export interface IWorkflowStep {
    readonly debugName: string;
    readonly errorBehaviour : WorkflowStepErrorBehaviour;
    run(context: IWorkflowContext): Promise<void>;
}
