import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';

import { SECRET } from '../../config.js';

export type TokenPayload = {
    id: string;
    name: string;
};

export const getSecret = (secret = SECRET) => {
    if (typeof secret !== 'string' || secret === '') {
        throw new Error('Bad Secret for token creation');
    }
    return secret;
};

export const createToken = (payload: TokenPayload) => {
    return jwt.sign(payload, getSecret());
};

export const readToken = (token: string) => {
    const payload = jwt.verify(token, getSecret());
    return payload as jwt.JwtPayload;
};

export const passwordEncrypt = (password: string) => {
    return bc.hash(password, 10);
};

export const passwordValidate = (newPassword: string, hash: string) => {
    return bc.compare(newPassword, hash);
};
