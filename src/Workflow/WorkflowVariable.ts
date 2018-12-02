import { WorkflowVariableName } from ".";

export interface IWorkflowTypedVariableType<T> {
    readonly name: string;

    /**
     * @returns undefined if there is no text representation
     */
    asText(value: T): string | undefined;

    asDebugText(value: T): string;

    defaultValue(): T;
}

export type IWorkflowVariableType = IWorkflowTypedVariableType<any>;

export class WorkflowTypedVariable<T> {
    private value: T;
    private name: WorkflowVariableName;

    public readonly type: IWorkflowTypedVariableType<T>;

    public constructor(type: IWorkflowTypedVariableType<T>, name: WorkflowVariableName, value: T) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

    public getName(): WorkflowVariableName {
        return this.name;
    }

    public getFullName(): string {
        return this.name.full;
    }

    public getValue(): T {
        return this.value;
    }

    public asText(): string | undefined {
        return this.type.asText(this.value);
    }

    public asDebugText(): string {
        return this.type.asDebugText(this.value);
    }
}

export type WorkflowVariable = WorkflowTypedVariable<any>;
