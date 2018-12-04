import { IWorkflowStep, WorkflowStepErrorBehaviour } from "../../src/Workflow";

export const MockedWorkflowStep = jest.fn<IWorkflowStep>((name, errorBehaviour) => ({
    name,
    errorBehaviour: errorBehaviour || WorkflowStepErrorBehaviour.Cancel,
    run: jest.fn(async () => { })
}));
