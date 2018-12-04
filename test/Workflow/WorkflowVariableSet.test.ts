import { MockedWorkflowVariableType } from "./MockedWorkflowVariableType";
import { WorkflowTypedVariable, WorkflowVariableSet } from "../../src/Workflow";

describe("WorkflowVariableSet", () => {
    const type1 = MockedWorkflowVariableType("mytype1");
    const type2 = MockedWorkflowVariableType("mytype2");
    const variable1 = new WorkflowTypedVariable(type1, "$varName1", "Hello Variable 1");
    const variable2 = new WorkflowTypedVariable(type2, "$ns.varName2", "Hello Variable 2");

    let variableSet: WorkflowVariableSet;

    beforeEach(() => {
        variableSet = new WorkflowVariableSet();
    });

    test("does start with an empty set", () => {
        expect(variableSet.count).toBe(0);

        let myCount = 0;
        for (const _ of variableSet)
            myCount++;
        expect(myCount).toBe(0);
    });

    test("does add new variables", () => {
        variableSet.add(variable1);
        expect(variableSet.count).toBe(1);

        variableSet.add(variable2);
        expect(variableSet.count).toBe(2);
    });

    test("does check for already set variables", () => {
        variableSet.add(variable1);
        expect(() => variableSet.add(variable1)).toThrow();
    });

    test("does check if variables are present", () => {
        expect(variableSet.has("$varName1")).toBe(false);
        variableSet.add(variable1);
        expect(variableSet.has("$varName1")).toBe(true);
    });

    test("does return the variables by name", () => {
        expect(() => variableSet.get("$varName1")).toThrow();

        variableSet.add(variable1);

        const var1byName = variableSet.get(variable1.name);
        expect(var1byName).toBe(variable1);

        const var1ByString = variableSet.get(variable1.name.full);
        expect(var1ByString).toBe(variable1);
    });

    test("does return variables with type check", () => {
        variableSet.add(variable1);
        expect(() => variableSet.get("$NOPE:varName1")).toThrow();
    });

    test("does support iterating via for-of loop", () => {
        const emptyAcceptFn = jest.fn();
        for (const variable of variableSet)
            emptyAcceptFn(variable);
        expect(emptyAcceptFn).not.toBeCalled();

        variableSet.add(variable1);
        const oneAcceptFn = jest.fn();
        for (const variable of variableSet)
            oneAcceptFn(variable);
        expect(oneAcceptFn).toBeCalledWith(variable1);

        variableSet.add(variable2);
        const bothAcceptFn = jest.fn();
        for (const variable of variableSet)
            bothAcceptFn(variable);
        expect(bothAcceptFn).toBeCalledWith(variable1);
        expect(bothAcceptFn).toBeCalledWith(variable2);
    });
});