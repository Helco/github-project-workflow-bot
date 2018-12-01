import { ConfigContextMap, IConfigMessageReporter, IConfigContext, ConfigContextMapping, ConfigContextAnyNumber, ConfigContextAnyBoolean, ConfigContextAnyString } from "../../src/ConfigParser";
import { OtherTypeValues } from "./TypeValues";
import { MockedConfigMessageReporter } from "./MockedConfigMessageReporter";

describe("ConfigContextMap", () => {
    let reporter: IConfigMessageReporter;
    let context: TestConfigContextMap;

    class TestConfigContextMap extends ConfigContextMap {
        protected acceptMap(map: Map<string, IConfigContext>, reporter: IConfigMessageReporter): void { }
        protected readonly mapping: ConfigContextMapping;

        public constructor(mapping?: ConfigContextMapping) {
            super();
            if (mapping) {
                this.mapping = mapping;
                return;
            }
            this.mapping = new ConfigContextMapping();
            this.mapping.add("first", ConfigContextAnyNumber);
            this.mapping.add("second", ConfigContextAnyBoolean);
            this.mapping.add("third", ConfigContextAnyString);
            this.mapping.setParameters([
                "[first]", "second", "[third]"
            ]);
            this.mapping.seal();
        }
    }

    beforeEach(() => {
        reporter = new MockedConfigMessageReporter();
        context = new TestConfigContextMap();
    });

    test("does not accept any other types", () => {
        const invalidValues = OtherTypeValues([ "string", "object" ]);
        invalidValues.push([ 1, 2, 3 ]);
        for (const value of invalidValues) {
            const reporter = MockedConfigMessageReporter();
            const context = new TestConfigContextMap();
            context.accept(value, reporter);
            expect(reporter.reportError).toBeCalledTimes(1);
        }
    });

    test("does accept object map", () => {
        context.accept({
            "first": 2,
            "second": true,
            "third": "bla"
        }, reporter);

        expect(reporter.reportError).not.toBeCalled();
    });

    test("does accept partial object map", () => {
        context.accept({
            "first": 3
        }, reporter);

        expect(reporter.reportError).not.toBeCalled();
    });

    test("does accept empty object map", () => {
        context.accept({ }, reporter);

        expect(reporter.reportError).not.toBeCalled();
    });

    test("does warn about invalid property names", () => {
        context.accept({
            "brabbel": 1
        }, reporter);

        expect(reporter.reportWarning).toBeCalledTimes(1);
    });

    test("does create map and accept property values", () => {
        let didCallFirstAccept = false;
        let didCallSecondAccept = false;
        let didCallThirdAccept = false;

        const mapping = new ConfigContextMapping();
        mapping.add("first", jest.fn<IConfigContext>(() => ({
            accept: jest.fn(() => didCallFirstAccept = true),
            getValue: jest.fn<number>(() => false)
        })));
        mapping.add("second", jest.fn<IConfigContext>(() => ({
            accept: jest.fn(() => didCallSecondAccept = true),
            getValue: jest.fn<number>(() => 42)
        })));
        mapping.add("third", jest.fn<IConfigContext>(() => ({
            accept: jest.fn(() => didCallThirdAccept = true),
            getValue: jest.fn<number>(() => "bad")
        })));
        mapping.seal();

        const context = new TestConfigContextMap(mapping);
        context.accept({
            "first": true,
            "second": 13
        }, reporter);

        expect(didCallFirstAccept).toBe(true);
        expect(didCallSecondAccept).toBe(true);
        expect(didCallThirdAccept).toBe(false);

        const map = context.getValue();
        expect(map.size).toBe(2);
        expect(map.get("first")).toBe(false);
        expect(map.get("second")).toBe(42);
    });

    test("does accept full parameter line", () => {
        context.accept("34 false bla", reporter);
        expect(reporter.reportError).not.toBeCalled();
    });

    test("does accept optional end parameter", () => {
        context.accept("34 false", reporter);
        expect(reporter.reportError).not.toBeCalled();
    });

    test("does accept optional start parameter", () => {
        context.accept("false bla", reporter);
        expect(reporter.reportError).not.toBeCalled();
    });

    test("does accept only required parameters", () => {
        context.accept("true", reporter);
        expect(reporter.reportError).not.toBeCalled();
    });

    test("does accept empty parameter line", () => {
        context.accept("", reporter);
        expect(reporter.reportError).not.toBeCalled();
    });

    test("does accept escaped string parameter", () => {
        context.accept("ON \"\\\\ \\\" \\n abc \\\"\"", reporter);
        expect(reporter.reportError).not.toBeCalled();
    });

    test("does create correct map with full parameter line", () => {
        context.accept("34 false bla", reporter);
        const map = context.getValue();

        expect(map.size).toBe(3);
        expect(map.get("first")).toBe(34);
        expect(map.get("second")).toBe(false);
        expect(map.get("third")).toBe("bla");
    });

    test("does create correct map with optional end parameter", () => {
        context.accept("34 false", reporter);
        const map = context.getValue();

        expect(map.size).toBe(2);
        expect(map.get("first")).toBe(34);
        expect(map.get("second")).toBe(false);
    });

    test("does create correct map with optional start parameter", () => {
        context.accept("false bla", reporter);
        const map = context.getValue();

        expect(map.size).toBe(2);
        expect(map.get("second")).toBe(false);
        expect(map.get("third")).toBe("bla");
    });

    test("does create correct map with only required parameters", () => {
        context.accept("true", reporter);
        const map = context.getValue();

        expect(map.size).toBe(1);
        expect(map.get("second")).toBe(true);
    });

    test("does accept empty parameter line", () => {
        context.accept("", reporter);
        const map = context.getValue();

        expect(map.size).toBe(0);
    });

    test("does accept escaped string parameter", () => {
        context.accept("ON \"\\\\ \\\" \\n abc \\\"\"", reporter);
        const map = context.getValue();

        expect(map.size).toBe(2);
        expect(map.get("second")).toBe(true);
        expect(map.get("third")).toBe("\\ \" \n abc \"");
    });
});
