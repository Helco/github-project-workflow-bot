import { IConfigContext, ConfigContextType } from './IConfigContext';
import { IConfigMessageReporter } from './IConfigMessageReporter';

export abstract class ConfigContextList<T extends IConfigContext> implements IConfigContext
{
    protected abstract readonly elementContextType: ConfigContextType<T>;
    protected elements: T[] = [];

    protected abstract acceptList(values: T[], reporter: IConfigMessageReporter): void;

    public accept(value: any, reporter: IConfigMessageReporter): void {
        const valueArray = Array.isArray(value) ? value : [ value ];
        this.elements = valueArray.map(v => new (this.elementContextType)());
        this.elements.forEach((element, i) => {
            element.accept(valueArray[i], reporter);
        });
        this.acceptList(this.elements, reporter);
    }

    public getValue() {
        return this.elements.map(el => el.getValue());
    }
}
