import { WorkflowTypedVariable } from "../../src/Workflow";
import { MockedWorkflowVariableType } from "./MockedWorkflowVariableType";

describe("WorkflowVariable", () => {
    test("does construct new variables", () => {
        const type = new MockedWorkflowVariableType("mytype");
        const variable = new WorkflowTypedVariable<any>(type, "$abc", "Hello World");

        expect(variable.type).toBe(type);
        expect(variable.name.equals("$abc"));
        expect(variable.getFullName()).toBe("$mytype:abc");
        expect(variable.getValue()).toBe("Hello World");
    });

    test("does delegate text format", () => {
        MockedWorkflowVariableType.mockImplementationOnce(() => ({
            asText: jest.fn((value) => `Mocked asText got \"${value}\"`)
        }));
        const type = new MockedWorkflowVariableType("mytype");
        const variable = new WorkflowTypedVariable<any>(type, "$abc", "Hello World");
        const asText = variable.asText();

        expect(asText).toBe("Mocked asText got \"Hello World\"");
        expect(type.asText).toBeCalledWith("Hello World");
    });

    test("does delegate debug text", () => {
        MockedWorkflowVariableType.mockImplementationOnce(() => ({
            asDebugText: jest.fn((value) => `Mocked asDebugText got \"${value}\"`)
        }));
        const type = new MockedWorkflowVariableType("mytype");
        const variable = new WorkflowTypedVariable<any>(type, "$abc", "Hello World");
        const asDebugText = variable.asDebugText();

        expect(asDebugText).toBe("Mocked asDebugText got \"Hello World\"");
        expect(type.asDebugText).toBeCalledWith("Hello World");
    });
});
