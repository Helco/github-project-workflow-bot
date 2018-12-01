import { IConfigMessageReporter } from "./IConfigMessageReporter";

type TransactionalMessage = {
    reportFunction: (message: string, context?: any) => void;
    message: string;
    context?: any;
}

export class ConfigTransactionalMessageReporter implements IConfigMessageReporter
{
    private parent: IConfigMessageReporter;
    private messages: TransactionalMessage[] = [];
    private didHaveErrors: boolean = false;

    public constructor(parent: IConfigMessageReporter) {
        this.parent = parent;
    }

    public reportWarning(message: string, context?: any): void {
        this.messages.push({
            message, context,
            reportFunction: this.parent.reportWarning
        });
    }

    public reportError(message: string, context?: any): void {
        this.messages.push({
            message, context,
            reportFunction: this.parent.reportError
        });
        this.didHaveErrors = true;
    }

    public hasErrors(): boolean {
        return this.didHaveErrors;
    }

    public reset(): void {
        this.messages.splice(0);
    }

    public commit(): void {
        for (const message of this.messages)
            message.reportFunction.call(this.parent, message.message, message.context);
    }
}