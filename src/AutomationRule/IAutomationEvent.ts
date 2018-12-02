import { IWorkflowVariableType } from "../Workflow";

export interface IAutomationEvent {
    readonly webhookName: string;
    readonly contextType: IWorkflowVariableType;
}
