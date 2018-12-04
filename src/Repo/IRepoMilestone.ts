export enum RepoMilestoneState {
    Open,
    Closed,
    All
}

export interface IRepoMilestone {
    readonly number: number;
    readonly title: string;
    readonly description: string;
    readonly creator: string;
    readonly state: RepoMilestoneState;
}
