export interface IConfigMessageReporter
{
    reportWarning(message: string, context?: any): void;
    reportError(message: string, context?: any): void;
    hasErrors(): boolean;
}
