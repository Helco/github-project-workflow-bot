import { IWorkflowVariableType } from "../../src/Workflow";

export const MockedWorkflowVariableType = jest.fn<IWorkflowVariableType>((name: string) => ({
    asText: jest.fn(),
    asDebugText: jest.fn(),
    defaultValue: jest.fn(),
    name: name
}));
