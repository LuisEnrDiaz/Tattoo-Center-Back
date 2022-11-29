export type id = number | string;

export interface UserRepository<UserI> {
    post: (data: Partial<UserI>) => Promise<UserI>;
    patch: (id: id, data: Partial<UserI>) => Promise<UserI>;
    delete: (id: id) => Promise<id>;
}
