import { IConfigMessageReporter } from './IConfigMessageReporter';
import { IConfigContext } from "./IConfigContext";

abstract class ConfigContextPrimitive<T extends string | number | boolean> implements IConfigContext {
    protected abstract readonly typeofName: string;
    protected abstract value: T;
    protected abstract acceptValue(value: T, reporter: IConfigMessageReporter): boolean;

    public accept(value: any, reporter: IConfigMessageReporter): void
    {
        if (typeof value !== this.typeofName)
            reporter.reportError("Expected string", value);
        else {
            this.value = value;
            this.acceptValue(value, reporter)
        }
    }

    public getValue(): T
    {
        return this.value;
    }
}

export abstract class ConfigContextNumber extends ConfigContextPrimitive<number> {
    protected readonly typeofName: string = "number";
    protected value: number = Number.NaN;
}
export class ConfigContextAnyNumber extends ConfigContextNumber {
    protected acceptValue(value: number, reporter: IConfigMessageReporter): boolean {
        return true;
    }
}

export abstract class ConfigContextString extends ConfigContextPrimitive<string> {
    protected readonly typeofName: string = "string";
    protected value: string = "";
}
export class ConfigContextAnyString extends ConfigContextString {
    protected acceptValue(value: string, reporter: IConfigMessageReporter): boolean {
        return true;
    }
}

export abstract class ConfigContextBoolean extends ConfigContextPrimitive<boolean> {
    protected readonly typeofName: string = "boolean";
    protected value: boolean = false;
}
export class ConfigContextAnyBoolean extends ConfigContextBoolean {
    protected acceptValue(value: boolean, reporter: IConfigMessageReporter): boolean {
        return true;
    }
}
