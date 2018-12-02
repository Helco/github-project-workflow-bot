export class WorkflowVariableName {
    public readonly full: string;
    /**
     * name in the variable set `namespace.member`
     */
    public readonly globalName: string;
    public readonly type: string;
    public readonly namespace: string;
    public readonly member: string;

    private constructor(type: string, namespace: string, member: string) {
        this.type = type;
        this.namespace = namespace;
        this.member = member;
        this.globalName = (namespace == "" ? "" : namespace + ".") + member;
        this.full = "$" + (type == "" ? "" : type + ":") + this.globalName;
    }

    public equals(other: WorkflowVariableName): boolean {
        return this.globalName === other.globalName;
    }

    public static fromFull(full: string): WorkflowVariableName {
        // actually just $<identifier>:<identifier>.<identifier>
        const PATTERN = /^\$([a-zA-Z_]\w*\:)?([a-zA-Z_]\w*\.)?([a-zA-Z_]\w*)$/;
        const parts = PATTERN.exec(full);
        if (parts === null)
            throw new Error(`Invalid variable name \"${full}\"`);
        return new WorkflowVariableName(parts[1] || "", parts[2] || "", parts[3]);
    }

    public static fromComponents(member: string, namespace?: string, type?: string): WorkflowVariableName {
        this.checkIdentifier(member);
        namespace && this.checkIdentifier(namespace);
        type && this.checkIdentifier(type);
        return new WorkflowVariableName(type || "", namespace || "", member);
    }

    private static checkIdentifier(identifier: string): void {
        if (/^[a-zA-Z_]\w*$/.exec(identifier) === null)
            throw new Error(`Invalid identifier ${identifier}`);
    }
}