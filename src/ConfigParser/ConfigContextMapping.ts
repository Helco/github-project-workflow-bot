import { ConfigContextAnyType } from "./";

type ConfigContextMapParameter = {
    name: string;
    isOptional: boolean;
};

export class ConfigContextMapping {
    private properties: Map<string, ConfigContextAnyType> = new Map();
    private parameters: ConfigContextMapParameter[] = [];
    private isSealed: boolean = false;

    public add(alias: string | string[], type: ConfigContextAnyType): void {
        this.checkSeal();
        if (typeof alias === "string")
            alias = [alias];
        for (const name of alias) {
            if (!this.isIdentifier(name))
                throw new Error(`Invalid property name \"${name}\"`);
            if (this.properties.has(name))
                throw new Error(`Mapping for \"${name} is already set`);
            this.properties.set(name, type);
        }
    }

    private isIdentifier(name: string): boolean {
        return /^[a-zA-Z_][\w]*$/.exec(name) !== null;
    }

    public setParameters(list: string[]): void {
        this.checkSeal();
        if (this.parameters.length > 0)
            throw new Error("Parameter line has already been set");
        list.forEach((param) => this.addParameter(param));
        if (this.parameters.length == 0)
            throw new Error("Invalid parameter line");
    }

    private addParameter(param: string): void {
        const isOptional = param.startsWith("[") && param.endsWith("]");
        const name = isOptional
            ? param.slice(1, -1)
            : param;
        if (!this.hasProperty(name))
            throw new Error(`Invalid parameter property \"${name}\"`);
        this.parameters.push({ name, isOptional });
    }

    /**
     * after this no modifications are allowed anymore
     */
    public seal(): void {
        this.isSealed = true;
    }

    private checkSeal() {
        if (this.isSealed)
            throw new Error("Mapping is sealed, no modifications allowed");
    }

    public hasProperty(name: string): boolean {
        return this.properties.has(name);
    }

    public getMinParameterCount(): number {
        return this.parameters.length -
            this.countOptionalParameters(0, this.properties.size);
    }

    public getMaxParameterCount(): number {
        return this.parameters.length;
    }

    public byName(name: string): ConfigContextAnyType {
        const type = this.properties.get(name);
        if (type === undefined)
            throw new Error(`No property mapping for parameter \"${name}\"`);
        return type;
    }

    /**
     * @returns possible property names in order
     */
    public byParameterIndex(actualI: number): string[] {
        if (actualI < 0 || actualI >= this.parameters.length)
            throw new Error("index out of bounds");
        return this.parameters.filter((_, paramI) => {
            const left = paramI - this.countOptionalParameters(0, paramI);
            return (left <= actualI && actualI <= paramI);
        }).map(param => param.name);
    }

    public parameterProperties(): string[] {
        return this.parameters.map(param => param.name);
    }

    private countOptionalParameters(from: number, to: number): number {
        return this.parameters
            .slice(from, to)
            .filter(param => param.isOptional)
            .length;
    }
}