import { WorkflowVariable, WorkflowVariableName } from ".";

export class WorkflowVariableSet {
    private variables = new Map<string, WorkflowVariable>();

    public get count(): number {
        return this.variables.size;
    }

    public has(name: string | WorkflowVariableName): boolean {
        if (typeof name === "string")
            name = WorkflowVariableName.fromFull(name);
        return this.variables.has(name.globalName);
    }

    public get(name: string | WorkflowVariableName): WorkflowVariable {
        if (typeof name === "string")
            name = WorkflowVariableName.fromFull(name);
        const variable = this.variables.get(name.globalName);
        if (variable === undefined)
            throw new Error(`Unknown variable name \"${name.globalName}\"`);
        if (name.type !== "" && name.type !== variable.type.name)
            throw new Error(`Unknown variable \"${name.globalName}\" with type ${name.type}`);
        return variable;
    }

    public add(variable: WorkflowVariable): void {
        if (this.has(variable.name))
            throw new Error(`Variable has already been set \"${variable.getFullName()}\"`);
        this.variables.set(variable.name.globalName, variable);
    }

    [Symbol.iterator] = function*(this: WorkflowVariableSet): IterableIterator<WorkflowVariable> {
        for (const variable of this.variables.values())
            yield variable;
    }

}
