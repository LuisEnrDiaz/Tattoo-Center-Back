import createDebug from 'debug';

import {
    Tattoo,
    TattooI,
} from '../../entities/tattooEntities/tattooEntities.js';
import { id, TattooRepo } from '../repository.js';

const debug = createDebug('TC:repository:tattooRepository');

export class TattooRepository implements TattooRepo<TattooI> {
    #Model = Tattoo;

    static instance: TattooRepository;

    public static getInstance(): TattooRepository {
        if (!TattooRepository.instance) {
            TattooRepository.instance = new TattooRepository();
        }
        return TattooRepository.instance;
    }

    private constructor() {
        debug('instance');
    }

    async getAllTattoo(): Promise<TattooI[]> {
        debug('getAllTattoo');
        const result = this.#Model.find().populate('owner', {
            favorites: 0,
        });

        return result;
    }

    async getTattoo(id: id): Promise<TattooI> {
        debug('getTattoo', id);

        const result = await this.#Model
            .findById(id)
            .populate('owner', { favorites: 0 });
        if (!result) {
            throw new Error('Not found id');
        }
        return result;
    }

    async createTattoo(data: Partial<TattooI>): Promise<TattooI> {
        debug('createTattoo', data);

        const result = await (
            await this.#Model.create(data)
        ).populate('owner', { tattoo: 0 });
        return result;
    }

    async updateTattoo(id: id, data: Partial<TattooI>): Promise<TattooI> {
        debug('updateTattoo', id);

        const result = await this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('owner', { tattoo: 0 });

        if (!result) {
            throw new Error('Not found id');
        }
        return result;
    }

    async deleteTattoo(id: id): Promise<id> {
        debug('deleteTattoo', id);

        await this.#Model
            .findByIdAndDelete(id)
            .populate('owner', { tattoo: 0 });

        return id;
    }

    getTattooModel() {
        return this.#Model;
    }
}
