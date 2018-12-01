import { MockedConfigMessageReporter } from "./MockedConfigMessageReporter";
import {
    ConfigContextAnyNumber,
    ConfigContextAnyString,
    ConfigContextAnyBoolean,
    ConfigContextNumber,
    ConfigContextString,
    ConfigContextBoolean,
    IConfigMessageReporter
} from "../../src/ConfigParser";
import { OtherTypeValues } from "./TypeValues";

describe("ConfigContextNumber", () => {
    test("does accept correct values", () => {
        const reporter1 = new MockedConfigMessageReporter();
        const context1 = new ConfigContextAnyNumber();
        context1.accept(42, reporter1);
        expect(reporter1.reportError).not.toBeCalled();

        const reporter2 = new MockedConfigMessageReporter();
        const context2 = new ConfigContextAnyNumber();
        context2.accept(-3.141592653, reporter2);
        expect(reporter2.reportError).not.toBeCalled();
    });

    test("does accept string numeric values", () => {
        const reporter1 = new MockedConfigMessageReporter();
        const context1 = new ConfigContextAnyNumber();
        context1.accept("42", reporter1);
        expect(reporter1.reportError).not.toBeCalled();

        const reporter2 = new MockedConfigMessageReporter();
        const context2 = new ConfigContextAnyNumber();
        context2.accept("-3.141592653" , reporter2);
        expect(reporter2.reportError).not.toBeCalled();
    });

    test("does not accept incorrect values", () => {
        for (const value of OtherTypeValues(["number"])) {
            const reporter = new MockedConfigMessageReporter();
            const context = new ConfigContextAnyNumber();
            context.accept(value, reporter);
            expect(reporter.reportError).toBeCalledTimes(1);
        }
    });

    test("does save the accepted value", () => {
        const reporter = new MockedConfigMessageReporter();
        const context = new ConfigContextAnyNumber();
        context.accept(1337, reporter);
        expect(context.getValue()).toBe(1337);
    });

    test("does save the accepted string value", () => {
        const reporter = new MockedConfigMessageReporter();
        const context = new ConfigContextAnyNumber();
        context.accept("-3.141", reporter);
        expect(context.getValue()).toBeCloseTo(-3.141);
    });

    test("does call the acceptValue method", () => {
        let didCall = 0;
        class TestConfigContext extends ConfigContextNumber {
            protected acceptNumber(value: number, reporter: IConfigMessageReporter): void {
                didCall++;
                expect(value).toBe(1337);
            }
        }

        const reporter = new MockedConfigMessageReporter();
        const context = new TestConfigContext();
        context.accept(1337, reporter);
        expect(didCall).toBe(1);
    });
});

describe("ConfigContextString", () => {
    test("does accept correct values", () => {
        const reporter1 = new MockedConfigMessageReporter();
        const context1 = new ConfigContextAnyString();
        context1.accept("abc", reporter1);
        expect(reporter1.reportError).not.toBeCalled();

        const reporter2 = new MockedConfigMessageReporter();
        const context2 = new ConfigContextAnyString();
        context2.accept("", reporter2);
        expect(reporter2.reportError).not.toBeCalled();
    });

    test("does not accept incorrect values", () => {
        for (const value of OtherTypeValues("string")) {
            const reporter = new MockedConfigMessageReporter();
            const context = new ConfigContextAnyString();
            context.accept(value, reporter);
            expect(reporter.reportError).toBeCalledTimes(1);
        }
    });

    test("does save the accepted value", () => {
        const reporter = new MockedConfigMessageReporter();
        const context = new ConfigContextAnyString();
        context.accept("Hello World", reporter);
        expect(context.getValue()).toBe("Hello World");
    });

    test("does call the acceptValue method", () => {
        let didCall = 0;
        class TestConfigContext extends ConfigContextString {
            protected acceptString(value: string, reporter: IConfigMessageReporter): void {
                didCall++;
                expect(value).toBe("Hi there");
            }
        }

        const reporter = new MockedConfigMessageReporter();
        const context = new TestConfigContext();
        context.accept("Hi there", reporter);
        expect(didCall).toBe(1);
    });
});

describe("ConfigContextBoolean", () => {
    test("does accept correct values", () => {
        const reporter1 = new MockedConfigMessageReporter();
        const context1 = new ConfigContextAnyBoolean();
        context1.accept(false, reporter1);
        expect(reporter1.reportError).not.toBeCalled();

        const reporter2 = new MockedConfigMessageReporter();
        const context2 = new ConfigContextAnyBoolean();
        context2.accept(true, reporter2);
        expect(reporter2.reportError).not.toBeCalled();
    });

    test("does accept correct string values", () => {
        const reporter1 = new MockedConfigMessageReporter();
        const context1 = new ConfigContextAnyBoolean();
        context1.accept("false", reporter1);
        expect(reporter1.reportError).not.toBeCalled();

        const reporter2 = new MockedConfigMessageReporter();
        const context2 = new ConfigContextAnyBoolean();
        context2.accept("yes", reporter2);
        expect(reporter2.reportError).not.toBeCalled();
    });

    test("does not accept incorrect values", () => {
        for (const value of OtherTypeValues(["boolean", "string"])) {
            const reporter = new MockedConfigMessageReporter();
            const context = new ConfigContextAnyBoolean();
            context.accept(value, reporter);
            expect(reporter.reportError).toBeCalledTimes(1);
        }
    });

    test("does save the accepted value", () => {
        const reporter1 = new MockedConfigMessageReporter();
        const context1 = new ConfigContextAnyBoolean();
        context1.accept(true, reporter1);
        expect(context1.getValue()).toBe(true);

        const reporter2 = new MockedConfigMessageReporter();
        const context2 = new ConfigContextAnyBoolean();
        context2.accept(false, reporter2);
        expect(context2.getValue()).toBe(false);
    });

    test("does save the accepted string value", () => {
        const reporter1 = new MockedConfigMessageReporter();
        const context1 = new ConfigContextAnyBoolean();
        context1.accept("yes", reporter1);
        expect(context1.getValue()).toBe(true);

        const reporter2 = new MockedConfigMessageReporter();
        const context2 = new ConfigContextAnyBoolean();
        context2.accept("OFF", reporter2);
        expect(context2.getValue()).toBe(false);
    });

    test("does call the acceptValue method", () => {
        let didCall = 0;
        class TestConfigContext extends ConfigContextBoolean {
            protected acceptBoolean(value: boolean, reporter: IConfigMessageReporter): void {
                didCall++;
                expect(value).toBe(true);
            }
        }

        const reporter = new MockedConfigMessageReporter();
        const context = new TestConfigContext();
        context.accept(true, reporter);
        expect(didCall).toBe(1);
    });
});
