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
                id: user.id.toString(),
                name: user.name,
            });

            res.json({ token });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            debug('deleteUser');

            await this.userRepository.deleteUser(req.params.id);
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
            const user = await this.userRepository.getUser(req.params.id);
            user.favorites.push(req.body.favorites);

            const result = await this.userRepository.updateUserFavorites(
                req.params.id,
                user
            );

            res.json({ result });
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
