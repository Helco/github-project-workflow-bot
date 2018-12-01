import { ConfigContextMapping, IConfigContext } from "../../src/ConfigParser";

describe("ConfigContextMapping", () => {
    let mapping: ConfigContextMapping;
    const StubConfigContextOne = jest.fn<IConfigContext>();
    const StubConfigContextTwo = jest.fn<IConfigContext>();
    const StubConfigContextThree = jest.fn<IConfigContext>();

    function addThreeConfigContexts(mapping: ConfigContextMapping) {
        mapping.add("abc", StubConfigContextOne);
        mapping.add("def", StubConfigContextTwo);
        mapping.add("ghi", StubConfigContextThree);
    }

    beforeEach(() => {
        mapping = new ConfigContextMapping();
    });

    test("does add properties to the mapping", () => {
        addThreeConfigContexts(mapping);

        expect(mapping.hasProperty("abc")).toBe(true);
        expect(mapping.hasProperty("def")).toBe(true);
        expect(mapping.hasProperty("ghi")).toBe(true);
        expect(mapping.hasProperty("ijk")).toBe(false);
    });

    test("does return the property types back", () => {
        addThreeConfigContexts(mapping);

        expect(mapping.byName("ghi")).toBe(StubConfigContextThree);
        expect(mapping.byName("def")).toBe(StubConfigContextTwo);
        expect(mapping.byName("abc")).toBe(StubConfigContextOne);
    });

    test("does check for correct property names", () => {
        addThreeConfigContexts(mapping);

        expect(() => mapping.byName("ijk")).toThrow();
        expect(() => mapping.byName("abc")).not.toThrow();
    });

    test("does not overwrite set properties", () => {
        mapping.add("abc", StubConfigContextOne);

        expect(() => { mapping.add("abc", StubConfigContextTwo) }).toThrow();
        expect(() => { mapping.add("abc", StubConfigContextOne) }).toThrow();
    });

    test("does not accept valid identifiers", () => {
        expect(() => { mapping.add("abc", StubConfigContextOne) }).not.toThrow();
        expect(() => { mapping.add("abc123", StubConfigContextOne) }).not.toThrow();
        expect(() => { mapping.add("_1_55__xy", StubConfigContextOne) }).not.toThrow();
        expect(() => { mapping.add("123", StubConfigContextOne) }).toThrow();
        expect(() => { mapping.add("a!c", StubConfigContextOne) }).toThrow();
        expect(() => { mapping.add("+bc", StubConfigContextOne) }).toThrow();
        expect(() => { mapping.add("1_xyz", StubConfigContextOne) }).toThrow();
    });

    test("does add multiple names for property", () => {
        mapping.add([ "abc", "def", "ghi" ], StubConfigContextOne);

        expect(mapping.byName("abc")).toBe(StubConfigContextOne);
        expect(mapping.byName("def")).toBe(StubConfigContextOne);
        expect(mapping.byName("ghi")).toBe(StubConfigContextOne);
    });

    test("does set parameters with parameter line", () => {
        addThreeConfigContexts(mapping);
        mapping.setParameters(["def", "abc", "ghi"]);

        expect(mapping.getMinParameterCount()).toBe(3);
        expect(mapping.getMaxParameterCount()).toBe(3);
        expect(mapping.parameterProperties()).toEqual([ "def", "abc", "ghi" ]);
        expect(mapping.byParameterIndex(0)).toEqual([ "def" ]);
        expect(mapping.byParameterIndex(1)).toEqual([ "abc" ]);
        expect(mapping.byParameterIndex(2)).toEqual([ "ghi" ]);
    });

    test("does set optional parameters at end", () => {
        addThreeConfigContexts(mapping);
        mapping.setParameters(["def", "abc", "[ghi]"]);

        expect(mapping.getMinParameterCount()).toBe(2);
        expect(mapping.getMaxParameterCount()).toBe(3);
        expect(mapping.byParameterIndex(0)).toEqual([ "def" ]);
        expect(mapping.byParameterIndex(1)).toEqual([ "abc" ]);
        expect(mapping.byParameterIndex(2)).toEqual([ "ghi" ]);
    });

    test("does set optional parameters in the middle", () => {
        addThreeConfigContexts(mapping);
        mapping.setParameters(["def", "[abc]", "ghi"]);

        expect(mapping.getMinParameterCount()).toBe(2);
        expect(mapping.getMaxParameterCount()).toBe(3);
        expect(mapping.byParameterIndex(0)).toEqual([ "def" ]);
        expect(mapping.byParameterIndex(1)).toEqual([ "abc", "ghi" ]);
        expect(mapping.byParameterIndex(2)).toEqual([ "ghi" ]);
    });

    test("does set optional parameters at start", () => {
        addThreeConfigContexts(mapping);
        mapping.setParameters(["[def]", "[abc]", "ghi"]);

        expect(mapping.getMinParameterCount()).toBe(1);
        expect(mapping.getMaxParameterCount()).toBe(3);
        expect(mapping.byParameterIndex(0)).toEqual(["def", "abc", "ghi"]);
        expect(mapping.byParameterIndex(1)).toEqual(["abc", "ghi"]);
        expect(mapping.byParameterIndex(2)).toEqual(["ghi"]);
    });

    test("does set all parameters optional", () => {
        addThreeConfigContexts(mapping);
        mapping.setParameters(["[ghi]", "[def]", "[abc]"]);

        expect(mapping.getMinParameterCount()).toBe(0);
        expect(mapping.getMaxParameterCount()).toBe(3);
        expect(mapping.byParameterIndex(0)).toEqual(["ghi", "def", "abc"]);
        expect(mapping.byParameterIndex(1)).toEqual(["def", "abc"]);
        expect(mapping.byParameterIndex(2)).toEqual(["abc"]);
    });

    test("does check for invalid parameter lines", () => {
        addThreeConfigContexts(mapping);

        expect(() => mapping.setParameters([])).toThrow();
        expect(() => mapping.setParameters([ "[abc" ])).toThrow();
        expect(() => mapping.setParameters([ "abc]" ])).toThrow();
        expect(() => mapping.setParameters([ "gebrabbel]" ])).toThrow();
        expect(() => mapping.setParameters([ "123_xyz]" ])).toThrow();
        expect(() => mapping.setParameters([ "  abc" ])).toThrow();
        expect(() => mapping.setParameters([ "abc  " ])).toThrow();
    });

    test("does check for repeated parameter set", () => {
        addThreeConfigContexts(mapping);
        mapping.setParameters([ "abc" ]);

        expect(() => mapping.setParameters([ "def" ])).toThrow();
        expect(() => mapping.setParameters([ "abc" ])).toThrow();
    });

    test("does seal", () => {
        addThreeConfigContexts(mapping);
        mapping.seal();

        expect(() => mapping.add("ijk", StubConfigContextOne)).toThrow();
        expect(() => mapping.setParameters([ "abc" ])).toThrow();
    });

    test("does not unseal", () => {
        addThreeConfigContexts(mapping);
        mapping.seal();
        mapping.seal();

        expect(() => mapping.add("ijk", StubConfigContextOne)).toThrow();
        expect(() => mapping.setParameters([ "abc" ])).toThrow();
    });


});