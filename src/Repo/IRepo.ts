import {
    IRepoIssue,
    IPaginatedList,
    IRepoMilestone,
    IRepoIssueState,
    IRepoLabel,
    RepoMilestoneState,
    RepoProjectState,
    IRepoProject
} from ".";

export interface RepoIssueFilter {
    readonly milestone?: number | string | IRepoMilestone;
    readonly state?: IRepoIssueState;
    readonly assignee?: string;
    readonly creator?: string;
    readonly mentioned?: string;
    readonly labels?: string | string[] | IRepoLabel | IRepoLabel[];
    readonly isPullRequest?: boolean;
}

export interface RepoMilestoneFilter {
    readonly state?: RepoMilestoneState;
}

export interface RepoProjectFilter {
    readonly state?: RepoProjectState;
}

export interface IRepo {
    readonly owner: string;
    readonly name: string;

    issue(number: number): Promise<IRepoIssue>;
    issues(filter?: RepoIssueFilter): IPaginatedList<IRepoIssue>;
    labels(): IPaginatedList<IRepoLabel>;
    milestone(number: number): Promise<IRepoMilestone>;
    milestones(filter?: RepoMilestoneFilter): IPaginatedList<IRepoMilestone>;
    projects(filter?: RepoProjectFilter): IPaginatedList<IRepoProject>;
}
