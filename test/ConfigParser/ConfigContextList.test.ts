import { ConfigContextList, ConfigContextAnyNumber, IConfigMessageReporter } from "../../src/ConfigParser";
import { MockedConfigMessageReporter } from "./MockedConfigMessageReporter";
import { OtherTypeValues } from "../TypeValues";

describe("ConfigContextList", () => {
    class TestConfigContextNumberList extends ConfigContextList<ConfigContextAnyNumber> {
        public didCallAcceptedList = 0;
        protected elementContextType = ConfigContextAnyNumber;

        protected acceptList(values: ConfigContextAnyNumber[], reporter: IConfigMessageReporter): void {
            this.didCallAcceptedList++;
        }
    }

    test("does accept correct lists", () => {
        const reporter1 = MockedConfigMessageReporter();
        const context1 = new TestConfigContextNumberList();
        context1.accept([ 1, 2, 3 ], reporter1);
        expect(reporter1.reportError).not.toBeCalled();

        const reporter2 = MockedConfigMessageReporter();
        const context2 = new TestConfigContextNumberList();
        context2.accept([], reporter2);
        expect(reporter2.reportError).not.toBeCalled();
    });

    test("does accept single values", () => {
        const reporter = MockedConfigMessageReporter();
        const context = new TestConfigContextNumberList();
        context.accept(42, reporter);
        expect(reporter.reportError).not.toBeCalled();
    });

    test("does not accept any other types", () => {
        for (const value of OtherTypeValues("number")) {
            const reporter = MockedConfigMessageReporter();
            const context = new TestConfigContextNumberList();
            context.accept(value, reporter);
            expect(reporter.reportError).toBeCalledTimes(1);
        }
    });

    test("does call the acceptList method", () => {
        const reporter1 = MockedConfigMessageReporter();
        const context1 = new TestConfigContextNumberList();
        context1.accept([ 1, 2, 3 ], reporter1);
        expect(context1.didCallAcceptedList).toBe(1);

        const reporter2 = MockedConfigMessageReporter();
        const context2 = new TestConfigContextNumberList();
        context2.accept(1337, reporter2);
        expect(context2.didCallAcceptedList).toBe(1);
    });

    test("does return the correct value", () => {
        const reporter1 = MockedConfigMessageReporter();
        const context1 = new TestConfigContextNumberList();
        context1.accept([ 1, 2, 3 ], reporter1);
        expect(context1.getValue()).toEqual([ 1, 2, 3 ]);

        const reporter2 = MockedConfigMessageReporter();
        const context2 = new TestConfigContextNumberList();
        context2.accept(8080, reporter2);
        expect(context2.getValue()).toEqual([ 8080 ]);
    });
});