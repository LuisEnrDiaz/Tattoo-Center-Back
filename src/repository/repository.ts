export type id = number | string;

export interface UserRepo<T> {
    get: (id: id) => Promise<T>;
    post: (data: Partial<T>) => Promise<T>;
    find: (data: Partial<T>) => Promise<T>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}
