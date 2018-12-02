import { IConfigMessageReporter } from "./";

export interface IConfigContext {
    accept(value: any, reporter: IConfigMessageReporter): void;
    getValue(): any;
}

export interface ConfigContextType<T extends IConfigContext> {
    new(): T;
}

export type ConfigContextAnyType = ConfigContextType<IConfigContext>;
