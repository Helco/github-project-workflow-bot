import { WorkflowVariable, WorkflowVariableName } from ".";

export class WorkflowVariableSet {
    private variables = new Map<string, WorkflowVariable>();

    public has(name: string | WorkflowVariableName): boolean {
        if (typeof name !== "string")
            name = name.globalName;
        return this.variables.has(name);
    }

    public get(name: string | WorkflowVariableName): WorkflowVariable {
        if (typeof name !== "string")
            name = name.globalName;
        const variable = this.variables.get(name);
        if (variable === undefined)
            throw new Error(`Unknown variable name \"${name}\"`);
        return variable;
    }

    public set(variable: WorkflowVariable): void {
        this.variables.set(variable.getName().globalName, variable);
    }

    [Symbol.iterator] = function*(this: WorkflowVariableSet): IterableIterator<WorkflowVariable> {
        for (const variable of this.variables.values())
            yield variable;
    }

}
