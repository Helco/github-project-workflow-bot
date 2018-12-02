import { WorkflowTransactionalMessageReporter } from './WorkflowTransactionalMessageReporter';
import { IWorkflowAction, IWorkflowContext, WorkflowVariableSet, IWorkflowMessageReporter } from ".";

class Context implements IWorkflowContext {
    public readonly workflow: Workflow;
    public readonly variables = new WorkflowVariableSet();
    public readonly reporter: IWorkflowMessageReporter;

    public constructor(workflow: Workflow, reporter: IWorkflowMessageReporter) {
        this.workflow = workflow;
        this.reporter = reporter;
    }
}

export class Workflow {
    private steps: IWorkflowAction[] = [];
    private isSealed = false;
    private currentStep: number = -1;

    public addStep(action: IWorkflowAction): void
    {
        if (this.isSealed)
            throw new Error("Workflow is sealed, no modifications are allowed");
        this.steps.push(action);
    }

    public seal(): void
    {
        this.isSealed = true;
    }

    public async start(reporter: IWorkflowMessageReporter): Promise<void>
    {
        if (this.hasStarted())
            throw new Error("Workflow has already been started");
        this.seal();

        reporter.reportInfo("Workflow started");
        for (this.currentStep = 0; this.currentStep < this.steps.length; this.currentStep++) {
            const stepReporter = new WorkflowTransactionalMessageReporter(reporter);
            const context = this.createContext(reporter);
            const step = this.steps[this.currentStep];
            await step.run(context);
            
            if (!this.handleStepError(step, stepReporter)) {
                reporter.reportInfo("Workflow was cancelled");
                return;
            }
        }
        reporter.reportInfo("Workflow finished");
    }

    private createContext(reporter: IWorkflowMessageReporter): Context {
        return new Context(this, reporter);
    }

    /**
     * @returns true if the workflow should continue
     */
    private handleStepError(step: IWorkflowAction, stepReporter: WorkflowTransactionalMessageReporter): boolean {
        if (stepReporter.hasErrors()) {
            if (step.errorBehaviour.shouldReport)
                stepReporter.commit();
        }
        return step.errorBehaviour.shouldContinue;
    }

    public hasStarted(): boolean
    {
        return this.currentStep >= 0;
    }

    public hasFinished(): boolean
    {
        return this.currentStep >= this.steps.length;
    }
}