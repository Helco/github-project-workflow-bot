export interface IPaginatedList<T> {
    [Symbol.asyncIterator]: (this: IPaginatedList<T>) => AsyncIterableIterator<T>;
}
