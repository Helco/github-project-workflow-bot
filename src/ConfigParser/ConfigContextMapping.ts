import { ConfigContextAnyType } from "./IConfigContext";

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
            if (this.properties.has(name))
                throw new Error(`Mapping for \"${name} is already set`);
            this.properties.set(name, type);
        }
    }

    public setParameters(line: string): void {
        this.checkSeal();
        if (this.parameters.length > 0)
            throw new Error("Parameter line has already been set");
        const PATTERN = /(\w+|\[\w+\])(\s+|$)/g;
        let parameterMatch = PATTERN.exec(line);
        while (parameterMatch !== null) {
            this.addParameter(parameterMatch[1]);
            parameterMatch = PATTERN.exec(line);
        }
        if (this.parameters.length == 0)
            throw new Error("Invalid parameter line");
    }

    private addParameter(param: string): void {
        const isOptional = param.startsWith("[") && param.endsWith("]");
        const name = isOptional
            ? param.slice(1, -1)
            : param;
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
    public byParameterIndex(index: number): string[] {
        if (index < 0 || index >= this.parameters.length)
            throw new Error("index out of bounds");
        const min = index - this.countOptionalParameters(0, index);
        const max = index + this.countOptionalParametersSequence(index);
        return this.parameters
            .slice(min, max + 1)
            .map(param => param.name);
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

    private countOptionalParametersSequence(from: number): number {
        const firstRequired = this.parameters
            .findIndex((param, i) => i >= from && !param.isOptional);
        return firstRequired < 0
            ? this.parameters.length - from
            : firstRequired - from;
    }
}