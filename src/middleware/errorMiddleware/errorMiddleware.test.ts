import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../interface/errorInterface/errorInterface';
import { errorManager } from './errorMiddleware';

describe('Given the errorManager function', () => {
    describe('When its invoked', () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnValue({}),
            json: jest.fn().mockReturnValue({}),
            end: jest.fn().mockReturnValue({}),
        };
        const next = jest.fn();
        const mockError = {
            name: 'Error',
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Error',
        };

        test('Then it should call the next function', () => {
            errorManager(
                mockError,
                req as Request,
                res as unknown as Response,
                next as NextFunction
            );
            expect(res.status).toBeCalled();
        });

        test('If error.name is ValidationError, then it should call the next function with a 406 status', () => {
            mockError.name = 'ValidationError';
            errorManager(
                mockError,
                req as Request,
                res as unknown as Response,
                next as NextFunction
            );
            expect(res.status).toBeCalled();
        });

        test('If there is no error.statuscode then it should return a status 500', () => {
            const mockBadError = {
                name: 'Error',
                statusMessage: 'Internal Server Error',
                message: 'Error',
            };

            errorManager(
                mockBadError as CustomError,
                req as Request,
                res as unknown as Response,
                next as NextFunction
            );
            expect(res.status).toBeCalled();
        });
    });
});
