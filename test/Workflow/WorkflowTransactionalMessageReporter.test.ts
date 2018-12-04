import { IWorkflowMessageReporter, WorkflowTransactionalMessageReporter } from "../../src/Workflow";
import { MockedWorkflowMessageReporter } from "./MockedWorkflowMessageReporter";

describe("WorkflowTransactionalMessageReporter", () => {
    function reportSomeStuff(reporter: IWorkflowMessageReporter) {
        reporter.reportWarning("abc");
        reporter.reportError("def");
        reporter.reportInfo("ghi");
    }

    test("does not call the reporter early", () => {
        const parent = new MockedWorkflowMessageReporter();
        const reporter = new WorkflowTransactionalMessageReporter(parent);

        reportSomeStuff(reporter);
        reporter.hasErrors();

        expect(parent.reportInfo).not.toBeCalled();
        expect(parent.reportWarning).not.toBeCalled();
        expect(parent.reportError).not.toBeCalled();
        expect(parent.hasErrors).not.toBeCalled();
    });

    test("does call the reporter when committing", () => {
        const parent = new MockedWorkflowMessageReporter();
        const reporter = new WorkflowTransactionalMessageReporter(parent);

        reportSomeStuff(reporter);
        reporter.commit();

        expect(parent.reportWarning).toBeCalledWith("abc");
        expect(parent.reportError).toBeCalledWith("def");
        expect(parent.reportInfo).toBeCalledWith("ghi");
        expect(parent.hasErrors).not.toBeCalled();
    });

    test("does not call the reporter when resetting", () => {
        const parent = new MockedWorkflowMessageReporter();
        const reporter = new WorkflowTransactionalMessageReporter(parent);

        reportSomeStuff(reporter);
        reporter.reset();
        reporter.commit();

        expect(parent.reportWarning).not.toBeCalled();
        expect(parent.reportError).not.toBeCalled();
        expect(parent.reportInfo).not.toBeCalled();
        expect(parent.hasErrors).not.toBeCalled();
    });

    test("does remember reported errors", () => {
        const parent = new MockedWorkflowMessageReporter();
        const reporter = new WorkflowTransactionalMessageReporter(parent);

        expect(reporter.hasErrors()).toBe(false);

        reporter.reportWarning("abc");
        expect(reporter.hasErrors()).toBe(false);

        reporter.reportInfo("ghi");
        expect(reporter.hasErrors()).toBe(false);

        reporter.reportError("def");
        expect(reporter.hasErrors()).toBe(true);

        reporter.reset();
        expect(reporter.hasErrors()).toBe(false);
    });
});
