import { Response, Request, NextFunction } from 'express';

import { UserRepository } from '../../repository/userRepository/userRepository.js';
import { UserController } from './userController.js';
import { createToken, passwordValidate } from './../../services/auth/auth.js';
import {
    CustomError,
    HTTPError,
} from '../../interface/errorInterface/errorInterface.js';
import { TattooRepository } from '../../repository/tattooRepository/tattooRepository.js';
import { ExtraRequest } from '../../middleware/interceptors/interceptors.js';

jest.mock('./../../services/auth/auth.js');

const mockData = [
    {
        id: '1',
        name: 'pepe',
        email: '',
        image: '',
        favorites: [{ id: '1' }],
    },
    {
        id: '2',
        name: 'coco',
        email: '',
        image: '',
        favorites: [],
    },
];

const mockTattoo = { id: '1', favorites: ['123'] };

describe('Given the users controller,', () => {
    jest.setTimeout(20000);

    let repository: TattooRepository;
    let userRepository: UserRepository;
    let userController: UserController;
    let req: Partial<ExtraRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        repository = TattooRepository.getInstance();
        userRepository = UserRepository.getInstance();

        userController = new UserController(userRepository, repository);

        req = {};
        res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        next = jest.fn();
    });

    describe('Given register is called,', () => {
        test('Then register should return', async () => {
            userRepository.createUser = jest
                .fn()
                .mockResolvedValue(mockData[0]);
            req.body = { mockData };
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ user: mockData[0] });
        });
    });

    describe('Given login is called', () => {
        test('Then login should return', async () => {
            userRepository.findUser = jest.fn().mockResolvedValue(mockData[0]);
            const error: CustomError = new HTTPError(
                404,
                'Not found id',
                'message of error'
            );
            (passwordValidate as jest.Mock).mockResolvedValue(false);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { password: 'password' };
            await userController.login(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then login should have been called', async () => {
            (passwordValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { password: 'pepe' };

            await userController.login(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalledWith({
                token: 'token',
                user: mockData[0],
            });
        });
    });

    describe('Given deleteUser is called', () => {
        test('Then deleteUSer should return', async () => {
            userRepository.deleteUser = jest.fn().mockResolvedValue({});
            req = {
                payload: { id: '1' },
            };
            await userController.deleteUser(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({});
        });
    });

    describe('Given getUser is called', () => {
        test('Then getUser should return', async () => {
            userRepository.getUser = jest.fn().mockResolvedValue(mockData[1]);
            req.params = { id: '2' };
            req.body = mockTattoo;
            await userController.getUser(req as Request, res as Response, next);

            expect(res.json).toHaveBeenNthCalledWith(1, { user: mockData[1] });
        });
    });

    describe('Given addTattooFavorites is called', () => {
        test('Then addTattooFavorites return', async () => {
            const result = {
                favorites: { id: '1' },
            };
            userRepository.updateUser = jest
                .fn()
                .mockResolvedValue(mockData[0].favorites);

            req = {
                payload: { id: '1', favorites: {} },
                body: { id: '2' },
            };

            req.body = result.favorites.id;

            await userController.addTattooFavorites(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({
                user: [result.favorites],
            });
        });

        test('Then addTattooFavorites return error', async () => {
            req = {
                body: {
                    id: '3',
                },
                payload: { id: '1234' },
            };
            userRepository.getUser = jest
                .fn()
                .mockResolvedValue({ favorites: [{ _id: '3' }] });

            userRepository.updateUser = jest.fn().mockResolvedValue('');

            await userController.addTattooFavorites(
                req as Request,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('Given deleteTattooFavorites is called', () => {
        test('Then deleteTattooFavorites return', async () => {
            req = {
                body: {
                    id: '3',
                },
                payload: { id: '1234' },
            };
            userRepository.getUser = jest
                .fn()
                .mockResolvedValue({ favorites: [{ _id: '6' }], id: '36' });
            repository.getTattoo = jest.fn().mockResolvedValue({ id: '3' });
            userRepository.updateUser = jest
                .fn()
                .mockResolvedValue({ favorites: [] });

            await userController.deleteTattooFavorites(
                req as Request,
                res as Response,
                next
            );

            expect(res.json).toHaveBeenCalled();
        });
    });
});

describe('Given UserController return error', () => {
    const error: CustomError = new HTTPError(
        404,
        'Not found id',
        'message of error'
    );
    const repository = TattooRepository.getInstance();
    const userRepo = UserRepository.getInstance();

    userRepo.getUser = jest.fn().mockRejectedValue('User');
    userRepo.createUser = jest.fn().mockRejectedValue(['User']);
    userRepo.deleteUser = jest.fn().mockRejectedValue('User');
    userRepo.updateUser = jest.fn().mockResolvedValue(['User']);

    const userController = new UserController(userRepo, repository);
    let req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    test('Given register should throw error', async () => {
        await userController.register(req as Request, res as Response, next);
        expect(error).toBeInstanceOf(HTTPError);
    });

    describe('Given login should throw error', () => {
        test('It should throw an error', async () => {
            await userController.login(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('Then deleteUser is called', () => {
        test('It should throw an error', async () => {
            await userController.deleteUser(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('Given addTattooFavorites should throw error', () => {
        test('It should throw an error', async () => {
            await userController.addTattooFavorites(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('Given getUser should throw error', () => {
        test('It should throw an error', async () => {
            req = { params: { id: 's' } };
            error.message = 'Not found id';
            userRepo.getUser = jest.fn().mockRejectedValue(error);
            await userController.getUser(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });

    describe('Given deleteTattooFAvorites throw error', () => {
        test('It should throw an error', async () => {
            await userController.deleteTattooFavorites(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
