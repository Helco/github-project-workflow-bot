import { IConfigMessageReporter, ConfigTransactionalMessageReporter } from "../../src/ConfigParser";
import { MockedConfigMessageReporter } from "./MockedConfigMessageReporter";

describe("ConfigTransactionalMessageReporter", () => {
    const errorContextObject = { "very": "complicated", "object": true };
    function reportWarningAndError(reporter: IConfigMessageReporter) {
        reporter.reportWarning("abc", false);
        reporter.reportError("def", errorContextObject);
    }

    test("does not call the reporter early", () => {
        const parent = new MockedConfigMessageReporter();
        const reporter = new ConfigTransactionalMessageReporter(parent);

        reportWarningAndError(reporter);
        reporter.hasErrors();

        expect(parent.reportWarning).not.toBeCalled();
        expect(parent.reportError).not.toBeCalled();
        expect(parent.hasErrors).not.toBeCalled();
    });

    test("does call the reporter when committing", () => {
        const parent = new MockedConfigMessageReporter();
        const reporter = new ConfigTransactionalMessageReporter(parent);
        const contextObject = { "very": "complicated", "object": true };

        reportWarningAndError(reporter);
        reporter.commit();

        expect(parent.reportWarning).toBeCalledWith("abc", false);
        expect(parent.reportError).toBeCalledWith("def", contextObject);
        expect(parent.hasErrors).not.toBeCalled();
    });

    test("does not call the reporter when resetting", () => {
        const parent = new MockedConfigMessageReporter();
        const reporter = new ConfigTransactionalMessageReporter(parent);

        reportWarningAndError(reporter);
        reporter.reset();
        reporter.commit();

        expect(parent.reportWarning).not.toBeCalled();
        expect(parent.reportError).not.toBeCalled();
        expect(parent.hasErrors).not.toBeCalled();
    });

    test("does remember reported errors", () => {
        const parent = new MockedConfigMessageReporter();
        const reporter = new ConfigTransactionalMessageReporter(parent);

        expect(reporter.hasErrors()).toBe(false);

        reporter.reportWarning("abc");
        expect(reporter.hasErrors()).toBe(false);

        reporter.reportError("def");
        expect(reporter.hasErrors()).toBe(true);

        reporter.reset();
        expect(reporter.hasErrors()).toBe(false);
    });
});
