import { debug } from 'console';
import { Request, Response, NextFunction } from 'express';

import { TattooI } from '../../entities/tattooEntities/tattooEntities.js';
import { UserI } from '../../entities/userEntities/userEntities.js';
import { HTTPError } from '../../interface/errorInterface/errorInterface.js';
import { TattooRepo, UserRepo } from '../../repository/repository.js';

export class TattooController {
    constructor(
        public tattooRepository: TattooRepo<TattooI>,
        public userRepository: UserRepo<UserI>
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

            const tattoos = await this.tattooRepository.getTattoo(
                req.params.id
            );

            res.json({ tattoos });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async createTattoo(req: Request, res: Response, next: NextFunction) {
        try {
            debug('createTattoo');
            const user = await this.userRepository.getUser(req.params.id);

            req.body.owner = user.id;

            const newTattoo = await this.tattooRepository.createTattoo(
                req.body
            );

            user.portfolio.push(newTattoo.id);

            const tattoos = await this.userRepository.updateUser(
                req.params.id,
                user
            );

            res.json({ tattoos });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async updateTattoo(req: Request, res: Response, next: NextFunction) {
        try {
            debug('updateTattoo');

            const user = await this.userRepository.getUser(req.params.id);

            if (user.id.toString() !== req.body.owner.toString()) {
                throw new Error('que no pesao');
            }

            user.portfolio.forEach((item) => {
                item._id.toString() !== req.body.id.toString();
            });

            await this.tattooRepository.updateTattoo(req.body.id, req.body);

            user.portfolio.push(req.body.id);

            const result = await this.userRepository.updateUser(
                req.params.id,
                user
            );

            res.json(result);
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    #createHttpError(error: Error) {
        if ((error as Error).message === 'Not found id') {
            const httpError = new HTTPError(
                404,
                'Not found',
                (error as Error).message
            );
            return httpError;
        }

        const httpError = new HTTPError(
            503,
            'Service unavailable',
            (error as Error).message
        );
        return httpError;
    }
}
