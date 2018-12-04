import { IRepoIssue } from ".";

export interface IRepoProjectCard {
    readonly note: string;
    readonly issueNumber?: number;

    issue(): Promise<IRepoIssue>;
}
