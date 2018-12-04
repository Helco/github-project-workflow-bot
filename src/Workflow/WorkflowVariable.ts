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

    public readonly type: IWorkflowTypedVariableType<T>;
    public readonly name: WorkflowVariableName;

    public constructor(type: IWorkflowTypedVariableType<T>, name: string | WorkflowVariableName, value: T) {
        if (typeof name === "string")
            name = WorkflowVariableName.fromFull(name);
        if (name.type !== "" && name.type !== type.name)
            throw new Error("Type from variable name does not match given type");
        this.type = type;
        this.name = WorkflowVariableName.fromComponents(
            name.member, name.namespace, type.name
        );
        this.value = value;
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
