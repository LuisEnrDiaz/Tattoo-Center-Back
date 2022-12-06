/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import createDebug from 'debug';

import { CustomError } from '../../interface/errorInterface/errorInterface.js';

const debug = createDebug('TC:middleware:errorManager');

export const errorManager = (
    error: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    debug(error.name, error.statusCode, error.statusMessage, error.message);

    let status = error.statusCode || 500;

    if (error.name === 'ValidationError') {
        status = 406;
    }

    const result = {
        status: status,
        type: error.name,
        error: error.message,
    };
    res.status(status);
    res.json(result);
    res.end();
};
