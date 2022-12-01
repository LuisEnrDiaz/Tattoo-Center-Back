export type id = number | string;

export interface UserRepo<T> {
    getUser: (id: id) => Promise<T>;
    createUser: (data: Partial<T>) => Promise<T>;
    findUser: (data: Partial<T>) => Promise<T>;
    updateUserFavorites: (id: id, data: Partial<T>) => Promise<T>;
    deleteUser: (id: id) => Promise<id>;
}

export interface TattooRepo<T> {
    getAllTattoo: () => Promise<Array<T>>;
    getTattoo: (id: id) => Promise<T>;
    createTattoo: (data: Partial<T>) => Promise<T>;
    updateTattoo: (id: id, data: Partial<T>) => Promise<T>;
    deleteTattoo: (id: id) => Promise<id>;
}
