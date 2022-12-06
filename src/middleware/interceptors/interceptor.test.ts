import { NextFunction, Request, Response } from 'express';

import { UserRepository } from '../../repository/userRepository/userRepository';
import { ExtraRequest, logged, who } from './interceptors';

describe('Given interceptor logged', () => {
    describe('When user is authorize', () => {
        const req: Partial<ExtraRequest> = {
            get: jest
                .fn()
                .mockReturnValueOnce(
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGYwNzA2N2Q3NDUxOGIzMjgxMTIwOSIsIm5hbWUiOiJtYXlhIiwiaWF0IjoxNjcwMzE3ODQwfQ.rBhTu9w7u2i62coY4y5fOm-sAEbp1u6Klq1gB-1Tza0'
                ),
        };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();
        test('then it returns the payload', () => {
            logged(req as ExtraRequest, res as Response, next);

            expect(req.payload).toStrictEqual({
                iat: expect.any(Number),
                id: expect.any(String),
                name: 'maya',
            });
            expect(next).toHaveBeenCalled();
        });

        test('Then authString is empty,should throw error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce(false),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test('Then if verifyToken its not valid should return error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce('Bearer token'),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
});

describe('Given the interceptor authentication', () => {
    describe('When we instantiate it', () => {
        const userRepo = UserRepository.getInstance();

        test('Then if the payload is correct', async () => {
            const req: Partial<ExtraRequest> = {
                payload: {
                    id: '638785e04ddf430eef1fcf6d',
                    name: 'maya',
                },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            userRepo.getUser = jest
                .fn()
                .mockResolvedValue({ id: '638785e04ddf430eef1fcf6d' });

            await who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test('if the req.payload is not correct', async () => {
            const req: Partial<ExtraRequest> = {
                payload: {
                    payload: {
                        id: '638785e04ddf730eef9fcf6d',
                        name: 'maya',
                    },
                },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            await who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test('if the req.payload is not correct, then it should call next and throw an error', async () => {
            const req: Partial<ExtraRequest> = {
                payload: {
                    payload: {
                        id: '638785e04ddf730eef9fcf6d',
                        name: 'maya',
                    },
                },
            };

            userRepo.getUser = jest
                .fn()
                .mockResolvedValue({ id: '638785e04ddf730eef9fcf6d' });

            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            await who(req as ExtraRequest, res as Response, next);

            expect(next).toHaveBeenCalled();
        });

        test('Then it should throw an error', () => {
            const req: Partial<ExtraRequest> = {
                payload: undefined,
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();
            const error = new Error('Wrong email or password');
            who(req as ExtraRequest, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(next).toHaveBeenCalled();
        });
    });
});
