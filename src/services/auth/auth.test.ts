import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';

import { SECRET } from '../../config.js';
import * as auth from './auth.js';

const mockData = {
    name: 'pepe',
    password: '123',
};

describe('Given getSecret is called', () => {
    describe('When it is not string o it is empty', () => {
        test('Then return error', () => {
            expect(() => {
                auth.getSecret('');
            }).toThrowError();
        });
    });
});

describe('Given createToken is called', () => {
    describe('When token is create', () => {
        const spyJwtSign = jest.spyOn(jwt, 'sign');
        const result = auth.createToken(mockData);
        expect(typeof result).toBe('string');
        expect(spyJwtSign).toHaveBeenCalledWith(mockData, SECRET);
    });
});

describe('Given readToken is called', () => {
    describe('When token is valid', () => {
        const validToken = auth.createToken(mockData);
        test('Then token is read', () => {
            const result = auth.readToken(validToken);
            expect(result.name).toEqual(mockData.name);
        });
    });

    describe('When there are no token', () => {
        const invalidToken = '';
        test('It should throw error', () => {
            expect(() => {
                auth.readToken(invalidToken);
            }).toThrowError();
        });
    });

    describe('When token is not valid', () => {
        const invalidToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlBlcGUiLCJpYXQiOjE2Njg3NzMwNTB9.DGdcCXGRUS4SaCMyY5RSy-8v9tylvmV_HE1rQJGYJ_55';

        test('It should throw error', () => {
            expect(() => {
                auth.readToken(invalidToken);
            }).toThrowError;
        });
    });
});

describe('Given passwordEncrypt', () => {
    const spyBcHash = jest.spyOn(bc, 'hash');
    const spyBcCompare = jest.spyOn(bc, 'compare');

    describe('When we call passwdEncrypt', () => {
        test('Bcrypt.hash should be call', async () => {
            await auth.passwordEncrypt('1234656');
            expect(spyBcHash).toHaveBeenCalled();
        });
    });

    describe('Whe we call passwdValidate, the passwd ans its encryption are compared', () => {
        let hash: string;
        const passwd = '123456';
        const badPasswd = '000000';

        beforeEach(async () => {
            hash = await auth.passwordEncrypt(passwd);
        });

        test('Then a valid password should be detected', async () => {
            const result = await auth.passwordValidate(passwd, hash);
            expect(spyBcCompare).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        test('Then a not valid password should be detected', async () => {
            const result = await auth.passwordValidate(badPasswd, hash);
            expect(spyBcCompare).toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });
});
