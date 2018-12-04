import { Workflow, WorkflowStepErrorBehaviour, IWorkflowContext } from "../../src/Workflow";
import { MockedWorkflowStep } from "./MockedWorkflowStep";
import { MockedWorkflowMessageReporter } from "./MockedWorkflowMessageReporter";

describe("Workflow", () => {
    let workflow: Workflow;

    beforeEach(() => {
        workflow = new Workflow();
    });

    test("does add new steps", () => {
        workflow.addStep(new MockedWorkflowStep("step1"));
        workflow.addStep(new MockedWorkflowStep("step2"));
    });

    test("does seal", () => {
        workflow.addStep(new MockedWorkflowStep("step1"));
        workflow.seal();

        expect(() => workflow.addStep(new MockedWorkflowStep("step2"))).toThrow();
    });

    test("does not unseal", () => {
        workflow.addStep(new MockedWorkflowStep("step1"));
        workflow.seal();
        workflow.seal();

        expect(() => workflow.addStep(new MockedWorkflowStep("step2"))).toThrow();
    });

    test("does check if there are any steps before start", () => {
        const reporter = new MockedWorkflowMessageReporter();
        expect(workflow.start(reporter)).rejects.toThrow();
    });

    test("does run all steps and in order", async () => {
        const step2 = new MockedWorkflowStep("step2");
        MockedWorkflowStep.mockImplementationOnce(() => ({
            name: "step1",
            errorBehaviour: WorkflowStepErrorBehaviour.Cancel,
            run: jest.fn(async (context: IWorkflowContext) => {
                expect(step2.run).not.toBeCalled();
            })
        }))
        const step1 = new MockedWorkflowStep();
        const reporter = new MockedWorkflowMessageReporter();

        workflow.addStep(step1);
        workflow.addStep(step2);
        workflow.seal();

        await workflow.start(reporter);

        expect(reporter.reportError).not.toBeCalled();
        expect(step1.run).toBeCalledTimes(1);
        expect(step2.run).toBeCalledTimes(1);
    });

    test("does cancel workflow on error", async () => {
        const step2 = new MockedWorkflowStep("step2");
        MockedWorkflowStep.mockImplementationOnce(() => ({
            name: "step1",
            errorBehaviour: WorkflowStepErrorBehaviour.Cancel,
            run: jest.fn(async (context: IWorkflowContext) => {
                context.reporter.reportError("mimimi");
            })
        }));
        const step1 = new MockedWorkflowStep();
        const reporter = new MockedWorkflowMessageReporter();

        workflow.addStep(step1);
        workflow.addStep(step2);
        workflow.seal();

        await workflow.start(reporter);

        expect(reporter.reportError).toBeCalledWith("mimimi");
        expect(step1.run).toBeCalledTimes(1);
        expect(step2.run).toBeCalledTimes(0);
    });

    test("does cancel workflow silently on error", async () => {
        const step2 = new MockedWorkflowStep("step2");
        MockedWorkflowStep.mockImplementationOnce(() => ({
            name: "step1",
            errorBehaviour: WorkflowStepErrorBehaviour.CancelSilently,
            run: jest.fn(async (context: IWorkflowContext) => {
                context.reporter.reportError("mimimi");
            })
        }));
        const step1 = new MockedWorkflowStep();
        const reporter = new MockedWorkflowMessageReporter();

        workflow.addStep(step1);
        workflow.addStep(step2);
        workflow.seal();

        await workflow.start(reporter);

        expect(reporter.reportError).not.toBeCalledWith("mimimi");
        expect(step1.run).toBeCalledTimes(1);
        expect(step2.run).toBeCalledTimes(0);
    });

    test("does not cancel workflow on ignored errors", async () => {
        const step2 = new MockedWorkflowStep("step2");
        MockedWorkflowStep.mockImplementationOnce(() => ({
            name: "step1",
            errorBehaviour: WorkflowStepErrorBehaviour.Ignore,
            run: jest.fn(async (context: IWorkflowContext) => {
                context.reporter.reportError("mimimi");
            })
        }));
        const step1 = new MockedWorkflowStep();
        const reporter = new MockedWorkflowMessageReporter();

        workflow.addStep(step1);
        workflow.addStep(step2);
        workflow.seal();

        await workflow.start(reporter);

        expect(reporter.reportError).toBeCalledWith("mimimi");
        expect(step1.run).toBeCalledTimes(1);
        expect(step2.run).toBeCalledTimes(1);
    });
});
