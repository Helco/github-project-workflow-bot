import { IConfigMessageReporter } from './IConfigMessageReporter';
import { IConfigContext } from "./IConfigContext";

export abstract class ConfigContextNumber implements IConfigContext {
    protected value: number = Number.NaN;
    protected abstract acceptNumber(value: number, reporter: IConfigMessageReporter): void;

    public accept(value: any, reporter: IConfigMessageReporter): void {
        if (typeof value === "number")
            this.value = value;
        else if (typeof value === "string" && !isNaN(+value))
            this.value = +value;
        else {
            reporter.reportError("Expected number", value);
            return;
        }
        this.acceptNumber(this.value, reporter);
    }

    public getValue() {
        return this.value;
    }
}
export class ConfigContextAnyNumber extends ConfigContextNumber {
    protected acceptNumber(value: number, reporter: IConfigMessageReporter): void { }
}

export abstract class ConfigContextString implements IConfigContext{
    protected value: string = "";
    protected abstract acceptString(value: string, reporter: IConfigMessageReporter): void;

    public accept(value: any, reporter: IConfigMessageReporter): void {
        if (typeof value !== "string") {
            reporter.reportError("Expected string", value);
            return;
        }
        this.value = value;
        this.acceptString(value, reporter);
    }

    public getValue() {
        return this.value;
    }
}
export class ConfigContextAnyString extends ConfigContextString {
    protected acceptString(value: string, reporter: IConfigMessageReporter): void { }
}

export abstract class ConfigContextBoolean implements IConfigContext {
    protected value: boolean = false;
    protected abstract acceptBoolean(value: boolean, reporter: IConfigMessageReporter): void;

    public accept(value: any, reporter: IConfigMessageReporter): void {
        if (typeof value === "boolean")
            this.value = value;
        else if (typeof value === "string")
            this.value = ["true", "yes", "on"].indexOf(value.toLowerCase()) >= 0;
        else {
            reporter.reportError("Expected boolean", value);
            return;
        }
        this.acceptBoolean(this.value, reporter);
    }

    public getValue() {
        return this.value;
    }
}
export class ConfigContextAnyBoolean extends ConfigContextBoolean {
    protected acceptBoolean(value: boolean, reporter: IConfigMessageReporter): void { }
}
