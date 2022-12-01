import createDebug from 'debug';
import { Types } from 'mongoose';

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
    createTattoo!: (data: Partial<TattooI>) => Promise<TattooI>;
    updateTattoo!: (id: id, data: Partial<TattooI>) => Promise<TattooI>;
    deleteTattoo!: (id: id) => Promise<id>;

    async getAllTattoo(): Promise<TattooI[]> {
        debug('getAllTattoo');
        const result = this.#Model.find().populate('owner', {
            Tattoo: 0,
        });
        return result;
    }

    async getTattoo(id: id): Promise<TattooI> {
        debug('getTattoo');
        const result = await this.#Model
            .findById(id)
            .populate<{ _id: Types.ObjectId }>('owner');
        if (!result) throw new Error('Not found id');
        return result;
    }
}
