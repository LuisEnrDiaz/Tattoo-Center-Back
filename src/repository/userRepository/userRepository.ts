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

    async getUser(id: id): Promise<UserI> {
        debug('getUser', id);

        const result = await this.#Model
            .findById(id)
            .populate('favorites')
            .populate('portfolio');
        if (!result) {
            throw new Error('not found id');
        }
        return result;
    }

    async createUser(data: Partial<UserI>): Promise<UserI> {
        debug('createUser', data);

        if (typeof data.password !== 'string') {
            throw new Error('');
        }
        data.password = await passwordEncrypt(data.password);

        const result = await this.#Model.create(data);
        return result as UserI;
    }

    async findUser(search: Partial<UserI>): Promise<UserI> {
        debug('findUser', { search });
        const result = await this.#Model.findOne(search);
        if (!result) throw new Error('not found id');
        return result;
    }

    async updateUser(id: id, data: Partial<UserI>): Promise<UserI> {
        debug('updateUser', id);

        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!result) {
            throw new Error('not found id');
        }
        return result;
    }

    async deleteUser(id: id): Promise<id> {
        debug('deleteUser', id);

        await this.#Model.findByIdAndDelete(id);
        return id;
    }

    getUserModel() {
        return this.#Model;
    }
}
