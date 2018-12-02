import { WorkflowVariableSet } from "./WorkflowVariableSet";
import { IWorkflowMessageReporter } from ".";

export interface IWorkflowContext {
    readonly variables: WorkflowVariableSet;
    readonly reporter: IWorkflowMessageReporter;
}
