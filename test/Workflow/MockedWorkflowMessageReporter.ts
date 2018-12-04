import { IWorkflowMessageReporter } from "../../src/Workflow";

export const MockedWorkflowMessageReporter = jest.fn<IWorkflowMessageReporter>(() => ({
    reportError: jest.fn(),
    reportWarning: jest.fn(),
    reportInfo: jest.fn(),
    hasErrors: jest.fn()
}));
