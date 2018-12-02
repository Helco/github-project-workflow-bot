export interface IWorkflowMessageReporter {
    reportInfo(message: string): void;
    reportWarning(message: string): void;
    reportError(message: string): void;
    hasErrors(): boolean;
}
