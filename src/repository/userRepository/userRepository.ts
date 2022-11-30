import createDebug from 'debug';

import { User, UserI } from '../../entities/userEntities/userEntities.js';
import { passwordEncrypt } from '../../services/auth/auth.js';
import { id, UserRepo } from '../repository.js';

const debug = createDebug('TC:repository:userRepository');

export class UserRepository implements UserRepo<UserI> {
    #Model = User;

    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    private constructor() {
        debug('instance');
    }

    async get(id: id): Promise<UserI> {
        debug('get', id);

        const result = await this.#Model.findById(id);
        if (!result) {
            throw new Error('not found id');
        }
        return result as UserI;
    }

    async create(data: Partial<UserI>): Promise<UserI> {
        debug('create', data);

        if (typeof data.password !== 'string') {
            throw new Error('');
        }
        data.password = await passwordEncrypt(data.password);

        const result = await this.#Model.create(data);
        return result as UserI;
    }

    async find(search: Partial<UserI>): Promise<UserI> {
        debug('find', { search });
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('not found id');
        return result;
    }

    async update(id: id, data: Partial<UserI>): Promise<UserI> {
        debug('update', id);

        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!result) {
            throw new Error('not found id');
        }

        return result;
    }

    async delete(id: id): Promise<id> {
        debug('delete', id);

        await this.#Model.findByIdAndDelete(id);
        return id;
    }

    getUserModel() {
        return this.#Model;
    }
}
