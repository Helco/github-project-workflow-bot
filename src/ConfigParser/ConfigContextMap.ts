import { IConfigContext } from "./IConfigContext";
import { IConfigMessageReporter } from "./IConfigMessageReporter";
import { ConfigContextMapping } from "./ConfigContextMapping";
import { ConfigTransactionalMessageReporter } from "./ConfigTransactionalMessageReporter";

export abstract class ConfigContextMap implements IConfigContext {
    protected abstract readonly mapping: ConfigContextMapping;
    protected abstract acceptMap(map: Map<string, IConfigContext>, reporter: IConfigMessageReporter): void;
    protected values: Map<string, IConfigContext> = new Map();

    public accept(value: any, reporter: IConfigMessageReporter): void {
        if (typeof value === "object" && !Array.isArray(value))
            this.acceptByProperties(value, reporter);
        else if (typeof value === "string")
            this.acceptByParameters(value, reporter);
        else
            reporter.reportError("Expected map or parameter list", value);
    }

    private acceptByProperties(value: any, reporter: IConfigMessageReporter): void {
        const propertyNames = Object.getOwnPropertyNames(value);
        for (const propertyName of propertyNames) {
            const { name, subName } = this.splitPropertyName(propertyName);
            if (!this.mapping.hasProperty(name)) {
                reporter.reportWarning("Unknown property", name);
                continue;
            }
            const propertyValue = subName === null
                ? value[name]
                : { [subName]: value[name] };
            this.acceptProperty(name, propertyValue, reporter);
        }
        this.acceptMap(this.values, reporter);
    }

    private splitPropertyName(fullName: string): { name: string, subName: string | null } {
        const spaceMatch = /\s+/.exec(fullName);
        return spaceMatch === null
            ? { name: fullName, subName: null }
            : {
                name: fullName.substr(0, spaceMatch.index),
                subName: fullName.substr(spaceMatch.index + spaceMatch[0].length)
            };
    }

    private acceptByParameters(parameterLine: string, reporter: IConfigMessageReporter): void{
        const lastAccepted: string = "";
        this.splitParameters(parameterLine, reporter).forEach((paramValue, i) => {
            const possibleProperties = this.filterParameterProperties(
                this.mapping.byParameterIndex(i), lastAccepted);
            const acceptedName = possibleProperties.find(propertyName => {
                const tmpReporter = new ConfigTransactionalMessageReporter(reporter);
                const context = new (this.mapping.byName(propertyName))();
                context.accept(paramValue, tmpReporter);
                return !tmpReporter.hasErrors();
            });
            if (typeof acceptedName === "undefined")
                reporter.reportError("Could not find matching parameter", paramValue);
            else
                this.acceptProperty(acceptedName, paramValue, reporter);
        });
        this.acceptMap(this.values, reporter);
    }

    private splitParameters(line: string, reporter: IConfigMessageReporter): string[] {
        /**
         * Black magic? you are right! Let me explain
         * first we assert that we are starting or being separated by some space (?:^|\s)+
         * then we go one of two ways
         *  1. (\w+) - simple parameter
         *  2. \"((?:[^\\\"]*|\\[\"ntabr])*?)(?:$|\") - not so simple string parameter
         *
         * string parameter starts with a double quote, then we search for either:
         *  1. [^\\\"]* as many good stuff as we can get
         *  2. \\[\"ntabr] an escape sequence
         *  3. repeat but don't be greedy
         * a string parameter ends with a double quote or the end $|\"
         *
         * for usability don't capture any group except the content of the parameter
         */
        const PARAM_PATTERN = /(?:^|\s)+(?:\"((?:[^\\\"]*|\\[\"\\ntabr])*?)(?:$|\")|(\w+))/gy;
        const parameters = [];
        let lastIndex = 0;
        let match = PARAM_PATTERN.exec(line);
        while (match !== null) {
            lastIndex = PARAM_PATTERN.lastIndex;
            parameters.push(this.unescapeParameter(match[1]));
            match = PARAM_PATTERN.exec(line);
        }
        if (line.substr(lastIndex).match(/[^\s]/) !== null)
            reporter.reportError("Invalid parameter line", line);
        return parameters;
    }

    private filterParameterProperties(possible: string[], lastAccepted: string): string[] {
        const all = this.mapping.parameterProperties();
        const remaining = lastAccepted === ""
            ? all
            : all.slice(all.indexOf(lastAccepted) + 1);
        return possible.filter(p => remaining.indexOf(p) >= 0);
    }

    private unescapeParameter(param: string): string {
        return param
            .replace(/\\"/g, "\"")
            .replace(/\\\\/g, "\\")
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\n")
            .replace(/\\a/g, "\n")
            .replace(/\\b/g, "\n")
            .replace(/\\r/g, "\n");
    }

    private acceptProperty(name: string, value: any, reporter: IConfigMessageReporter): void{
        if (this.values.has(name))
            throw new Error(`Property \"${name}\" has already been set`);
        const context = new (this.mapping.byName(name))();
        this.values.set(name, context);
        context.accept(value, reporter);
    }

    public getValue() {
        return this.values;
    }
}