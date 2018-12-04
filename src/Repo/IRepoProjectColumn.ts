import { IPaginatedList, IRepoProjectCard } from ".";

export enum RepoCardArchivedFilter {
    All,
    Archived,
    NotArchived
}

export interface RepoProjectCardFilter {
    readonly archivedState?: RepoCardArchivedFilter;
}

export interface IRepoProjectColumn {
    readonly name: string;

    cards(filter?: RepoProjectCardFilter): IPaginatedList<IRepoProjectCard>;
}
