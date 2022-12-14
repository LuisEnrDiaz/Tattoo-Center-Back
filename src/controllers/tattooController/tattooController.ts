import { debug } from 'console';
import { Request, Response, NextFunction } from 'express';

import { TattooI } from '../../entities/tattooEntities/tattooEntities.js';
import { UserI } from '../../entities/userEntities/userEntities.js';
import { HTTPError } from '../../interface/errorInterface/errorInterface.js';
import { ExtraRequest } from '../../middleware/interceptors/interceptors.js';
import { TattooRepo, UserRepo } from '../../repository/repository.js';

export class TattooController {
    constructor(
        public readonly tattooRepository: TattooRepo<TattooI>,
        public readonly userRepository: UserRepo<UserI>
    ) {
        debug('instance');
    }

    async getAllTattoo(req: Request, res: Response, next: NextFunction) {
        try {
            debug('getAllTattoo');

            const tattoos = await this.tattooRepository.getAllTattoo();

            res.json({ tattoos });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async getTattoo(req: Request, res: Response, next: NextFunction) {
        try {
            debug('getTattoo');

            const tattoo = await this.tattooRepository.getTattoo(req.params.id);

            res.json({ tattoo });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async createTattoo(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            debug('createTattoo');

            if (!req.payload) {
                throw new Error('error');
            }
            const user = await this.userRepository.getUser(req.payload.id);

            req.body.owner = user.id;

            const newTattoo = await this.tattooRepository.createTattoo(
                req.body
            );

            user.portfolio.push(newTattoo.id);

            const newUser = await this.userRepository.updateUser(
                req.payload.id,
                user
            );

            res.json({ newUser });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async updateTattoo(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            debug('updateTattoo');

            if (!req.payload) {
                throw new Error('error');
            }

            const user = await this.userRepository.getUser(req.payload.id);
            const tattoo = await this.tattooRepository.getTattoo(req.body.id);

            if (user.id.toString() !== tattoo.owner.toString()) {
                throw new Error('difference id');
            }
            await this.tattooRepository.updateTattoo(req.body.id, req.body);

            user.portfolio.filter((item) => {
                return item.id.toString() !== req.body.id.toString();
            });
            const result = await this.userRepository.updateUser(
                req.payload.id,
                user
            );

            user.portfolio.push(req.body.id);

            res.json({ result });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async deleteTattoo(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            debug('deleteTattoo');

            if (!req.payload) {
                throw new Error('error');
            }

            const user = await this.userRepository.getUser(req.payload.id);
            const tattoo = await this.tattooRepository.getTattoo(req.body.id);

            if (tattoo.owner._id.toString() !== user.id.toString()) {
                throw new Error('difference id propertied');
            }

            await this.tattooRepository.deleteTattoo(tattoo.id.toString());

            const filter = user.portfolio.filter((item) => {
                return item._id.toString() !== tattoo.id.toString();
            });
            console.log(user.portfolio);
            console.log(tattoo.id);
            const updateUser = await this.userRepository.updateUser(
                req.payload.id,
                { portfolio: filter }
            );

            res.json({ updateUser });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    #createHttpError(error: Error) {
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
