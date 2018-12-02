import { IWorkflowMessageReporter } from "./";

type TransactionalMessage = {
    reportFunction: (message: string) => void;
    message: string;
}

export class WorkflowTransactionalMessageReporter implements IWorkflowMessageReporter
{
    private parent: IWorkflowMessageReporter;
    private messages: TransactionalMessage[] = [];
    private didHaveErrors: boolean = false;

    public constructor(parent: IWorkflowMessageReporter) {
        this.parent = parent;
    }

    public reportInfo(message: string): void {
        this.messages.push({
            message,
            reportFunction: this.parent.reportInfo
        });
    }

    public reportWarning(message: string): void {
        this.messages.push({
            message,
            reportFunction: this.parent.reportWarning
        });
    }

    public reportError(message: string, context?: any): void {
        this.messages.push({
            message,
            reportFunction: this.parent.reportError
        });
        this.didHaveErrors = true;
    }

    public hasErrors(): boolean {
        return this.didHaveErrors;
    }

    public reset(): void {
        this.messages.splice(0);
        this.didHaveErrors = false;
    }

    public commit(): void {
        for (const message of this.messages)
            message.reportFunction.call(this.parent, message.message);
    }
}