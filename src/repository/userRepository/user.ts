import createDebug from 'debug';

import { User, UserI } from '../../entities/userEntities/user.js';
import { passwordEncrypt } from '../../services/auth/auth.js';
import { id, UserRepo } from '../repository.js';

const debug = createDebug('W8:repository:userRepository');

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
        return result;
    }

    async post(data: Partial<UserI>): Promise<UserI> {
        debug('post', data);

        if (typeof data.password !== 'string') {
            throw new Error('');
        }
        data.password = await passwordEncrypt(data.password);

        const result = await this.#Model.create(data);
        return result;
    }

    async find(search: Partial<UserI>): Promise<UserI> {
        debug('find', { search });
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('not found id');
        return result;
    }

    async patch(id: id, data: Partial<UserI>): Promise<UserI> {
        debug('patch', id);

        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!result) throw new Error('not found id');

        return result;
    }

    async delete(id: id): Promise<id> {
        debug('delete', id);

        const result = await this.#Model.findByIdAndDelete(id);

        if (result === null) {
            throw new Error('not found id');
        }
        return id;
    }

    getUserModel() {
        return this.#Model;
    }
}
