import createDebug from 'debug';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { HTTPError } from '../../interface/errorInterface/errorInterface.js';
import { TattooRepository } from '../../repository/tattooRepository/tattooRepository.js';
import { readToken } from '../../services/auth/auth.js';

const debug = createDebug('TC:middleware:interceptors');

export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}

export const logged = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('logged');
    const authString = req.get('Authorization');
    if (!authString || !authString?.startsWith('Bearer')) {
        next(
            new HTTPError(
                403,
                'Forbidden',
                'Usuario o contraseña incorrecto (Slice)'
            )
        );
        return;
    }
    try {
        const token = authString.slice(7);
        readToken(token);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'Forbidden', 'Usuario o contraseña incorrecto')
        );
    }
};

export const who = async (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('who');
    const repository = TattooRepository.getInstance();
    try {
        const tattoo = await repository.getTattoo(req.params.id);
        if (!req.payload || tattoo.owner._id.toString() !== req.payload.id) {
            next(
                new HTTPError(
                    403,
                    'Forbidden',
                    'Usuario o contraseña incorrecto'
                )
            );
        }
        next();
    } catch (error) {
        next(error);
    }
};
