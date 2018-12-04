import { IPaginatedList, IRepoProjectColumn } from ".";

export enum RepoProjectState {
    Open,
    Closed,
    All
}

export interface IRepoProject {
    readonly number: number;
    readonly name: string;
    readonly body: string;
    readonly creator: string;
    readonly state: RepoProjectState;

    columns(): IPaginatedList<IRepoProjectColumn>;
}
