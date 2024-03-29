import createDebug from 'debug';
import { Request, Response, NextFunction } from 'express';

import { TattooI } from '../../entities/tattooEntities/tattooEntities.js';
import { UserI } from '../../entities/userEntities/userEntities.js';
import { HTTPError } from '../../interface/errorInterface/errorInterface.js';
import { ExtraRequest } from '../../middleware/interceptors/interceptors.js';
import { TattooRepo, UserRepo } from '../../repository/repository.js';
import { createToken, passwordValidate } from '../../services/auth/auth.js';

const debug = createDebug('TC:Controller:userController');

export class UserController {
    constructor(
        public readonly userRepository: UserRepo<UserI>,
        public readonly tattooRepository: TattooRepo<TattooI>
    ) {
        debug('instance');
    }

    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            debug('getUser');

            const user = await this.userRepository.getUser(req.params.id);

            res.json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            debug('register');
            const user = await this.userRepository.createUser(req.body);
            res.status(201).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            debug('login', req.body.name);

            const user = await this.userRepository.findUser({
                name: req.body.name,
            });

            const isPasswordValid = await passwordValidate(
                req.body.password,
                user.password
            );
            if (!isPasswordValid) {
                throw new Error();
            }

            const token = createToken({
                name: user.name,
                id: user.id.toString(),
            });

            res.json({ token });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async deleteUser(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            debug('deleteUser');
            if (!req.payload) {
                throw new Error('');
            }
            await this.userRepository.deleteUser(req.payload.id);
            res.json({});
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async addTattooFavorites(
        req: ExtraRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            debug('addTattooFavorites');

            if (!req.payload) {
                throw new Error('Not found id');
            }

            const user = await this.userRepository.getUser(req.payload.id);

            user.favorites.forEach((item) => {
                if (item._id.toString() === req.body.id.toString()) {
                    throw new Error('Duplicated id');
                }
            });

            user.favorites.push(req.body.id);

            const favorites = await this.userRepository.updateUser(
                req.payload.id,
                user
            );
            res.json({ favorites });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async deleteTattooFavorites(
        req: ExtraRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            debug('deleteTattooFavorites');
            if (!req.payload) {
                throw new Error('Not found id');
            }

            const user = await this.userRepository.getUser(req.payload.id);
            const tattoo = await this.tattooRepository.getTattoo(req.body.id);

            const deleteTattoo = user.favorites.filter((item) => {
                return item._id.toString() !== tattoo.id.toString();
            });

            const updateTattoo = await this.userRepository.updateUser(
                user.id.toString(),
                {
                    favorites: deleteTattoo,
                }
            );

            res.json({ updateTattoo });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    #createHttpError(error: Error) {
        if (error.message === 'Not found id') {
            const httpError = new HTTPError(404, 'Not found', error.message);
            return httpError;
        }

        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
