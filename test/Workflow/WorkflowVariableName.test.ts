import { WorkflowVariableName } from "../../src/Workflow";

describe("WorkflowVariablename", () => {
    test("does accept correct full variable names", () => {
        expect(() => WorkflowVariableName.fromFull("$abc")).not.toThrow();
        expect(() => WorkflowVariableName.fromFull("$abc_123")).not.toThrow();
        expect(() => WorkflowVariableName.fromFull("$__abc_123")).not.toThrow();
        expect(() => WorkflowVariableName.fromFull("$def.abc")).not.toThrow();
        expect(() => WorkflowVariableName.fromFull("$_23_def.__1abc")).not.toThrow();
        expect(() => WorkflowVariableName.fromFull("$bli:bla.blubb")).not.toThrow();
        expect(() => WorkflowVariableName.fromFull("$bli:blubb")).not.toThrow();
    });

    test("does not accept incorrect full variable names", () => {
        expect(() => WorkflowVariableName.fromFull("")).toThrow();
        expect(() => WorkflowVariableName.fromFull("$")).toThrow();
        expect(() => WorkflowVariableName.fromFull("$123")).toThrow();
        expect(() => WorkflowVariableName.fromFull("$abc!?")).toThrow();
        expect(() => WorkflowVariableName.fromFull("$äöü")).toThrow();
        expect(() => WorkflowVariableName.fromFull("$bli.bla:blubb")).toThrow();
        expect(() => WorkflowVariableName.fromFull("$bli.")).toThrow();
        expect(() => WorkflowVariableName.fromFull("$bli:")).toThrow();
        expect(() => WorkflowVariableName.fromFull("$bli:bla.")).toThrow();
        expect(() => WorkflowVariableName.fromFull("$bli:bla.bubb$")).toThrow();
    });

    test("does split full variables names", () => {
        const name1 = WorkflowVariableName.fromFull("$abc");
        expect(name1.full).toBe("$abc");
        expect(name1.globalName).toBe("abc");
        expect(name1.type).toBe("");
        expect(name1.namespace).toBe("");
        expect(name1.member).toBe("abc");

        const name2 = WorkflowVariableName.fromFull("$bli:bla.blubb");
        expect(name2.full).toBe("$bli:bla.blubb");
        expect(name2.globalName).toBe("bla.blubb");
        expect(name2.type).toBe("bli");
        expect(name2.namespace).toBe("bla");
        expect(name2.member).toBe("blubb");
    });

    test("does create variable names from copmonents", () => {
        const name1 = WorkflowVariableName.fromComponents("abc");
        expect(name1.full).toBe("$abc");
        expect(name1.globalName).toBe("abc");
        expect(name1.type).toBe("");
        expect(name1.namespace).toBe("");
        expect(name1.member).toBe("abc");

        const name2 = WorkflowVariableName.fromComponents("blubb", "bla", "bli");
        expect(name2.full).toBe("$bli:bla.blubb");
        expect(name2.globalName).toBe("bla.blubb");
        expect(name2.type).toBe("bli");
        expect(name2.namespace).toBe("bla");
        expect(name2.member).toBe("blubb");
    });

    test("does check for invalid component identifiers", () => {
        expect(() => WorkflowVariableName.fromComponents("")).toThrow();
        expect(() => WorkflowVariableName.fromComponents("$abc")).toThrow();
        expect(() => WorkflowVariableName.fromComponents("abc!?§")).toThrow();
        expect(() => WorkflowVariableName.fromComponents("abc", "123")).toThrow();
        expect(() => WorkflowVariableName.fromComponents("abc", "def", "  ")).toThrow();
    });

    test("does compare two names correctly", () => {
        const nameFromFull = WorkflowVariableName.fromFull("$abc:def.ghi");
        const nameFromComponents = WorkflowVariableName.fromComponents("ghi", "def", "abc");
        const nameOtherType = WorkflowVariableName.fromFull("$XYZ:def.ghi");
        const nameOtherNamespace = WorkflowVariableName.fromFull("$abc:XYZ.ghi");
        const otherName = WorkflowVariableName.fromFull("$abc:def.XYZ");

        expect(nameFromFull.equals(nameFromComponents)).toBe(true);
        expect(nameFromComponents.equals(nameFromFull)).toBe(true);
        expect(nameOtherType.equals(nameFromFull)).toBe(true);
        expect(nameFromFull.equals(nameOtherNamespace)).toBe(false);
        expect(nameOtherNamespace.equals(nameFromFull)).toBe(false);
        expect(nameFromComponents.equals(otherName)).toBe(false);
        expect(nameFromFull.equals(otherName)).toBe(false);
    });
});
