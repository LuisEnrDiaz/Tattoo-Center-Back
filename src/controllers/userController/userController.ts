import createDebug from 'debug';
import { Request, Response, NextFunction } from 'express';

import { UserI } from '../../entities/userEntities/userEntities.js';
import { HTTPError } from '../../interface/errorInterface/errorInterface.js';
import { UserRepo } from '../../repository/repository.js';
import { createToken, passwordValidate } from '../../services/auth/auth.js';

const debug = createDebug('W8:Controller:userController');

export class UserController {
    constructor(public readonly repository: UserRepo<UserI>) {
        debug('instance');
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            debug('register');
            const user = await this.repository.post(req.body);
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

            const user = await this.repository.find({ name: req.body.name });
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

    async delete(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('delete');

            await this.repository.delete(req.params.id);
            resp.json({});
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
