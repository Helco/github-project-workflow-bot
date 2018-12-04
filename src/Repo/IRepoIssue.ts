import { IRepoMilestone, IRepoLabel } from ".";

export enum IRepoIssueState {
    Open,
    Closed,
    Merged
}

export interface IRepoIssue {
    readonly number: number;
    readonly title: string;
    readonly body: string;
    readonly user: string;
    readonly isPullRequest: boolean;
    readonly state: IRepoIssueState;
    readonly milestone?: IRepoMilestone;
    readonly labels: IRepoLabel[];
    readonly assignees: string[];
}

export interface IRepoPullRequest extends IRepoIssue {
    readonly headLabel: string;
    readonly baseLabel: string;
}
