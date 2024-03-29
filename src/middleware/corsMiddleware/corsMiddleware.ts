import { Request, Response, NextFunction } from 'express';

export const setCors = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.header('origin') || '*';

    res.setHeader('Access-Control-Allow-Origin', origin);
    next();
};
