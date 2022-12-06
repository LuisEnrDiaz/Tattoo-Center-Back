import { Request, Response, NextFunction } from 'express';
import {
    CustomError,
    HTTPError,
} from '../../interface/errorInterface/errorInterface';

import { TattooRepository } from '../../repository/tattooRepository/tattooRepository';
import { UserRepository } from '../../repository/userRepository/userRepository';
import { TattooController } from './tattooController';

describe('Given TattooController', () => {
    let tattooRepository: TattooRepository;
    let userRepository: UserRepository;
    let tattooController: TattooController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    const mockUser = {
        id: '63873678dd293e7b902063f5',
        name: 'pepe',
        portfolio: [{ id: '1' }],
    };

    const mockTattoo = [
        { id: '1', image: 'pepe', owner: '1' },
        { id: '2', image: 'coco', owner: '1' },
    ];
    const newTattoo = { image: 'maya' };

    beforeEach(() => {
        tattooRepository = TattooRepository.getInstance();
        userRepository = UserRepository.getInstance();
        tattooController = new TattooController(
            tattooRepository,
            userRepository
        );

        tattooRepository.deleteTattoo = jest.fn().mockReturnValue({});

        req = {
            params: { id: '13' },
            body: { id: '341', owner: '16' },
        };
        res = {
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe('When getAllTattoo is called', () => {
        test('Then getAllTattoo should return tattoos', async () => {
            tattooRepository.getAllTattoo = jest
                .fn()
                .mockReturnValue(['tattoo']);
            await tattooController.getAllTattoo(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ tattoos: ['tattoo'] });
        });
    });

    describe('When getTattoo is called', () => {
        test('Then getTattoo should return tattoo', async () => {
            tattooRepository.getTattoo = jest
                .fn()
                .mockReturnValue(mockTattoo[0]);

            await tattooController.getTattoo(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ tattoo: mockTattoo[0] });
        });
    });

    describe('When createTattoo is called', () => {
        test('Then createTattoo should return', async () => {
            tattooRepository.createTattoo = jest
                .fn()
                .mockReturnValue({ ...newTattoo, id: '1' });

            userRepository.getUser = jest.fn().mockResolvedValue(mockUser);
            userRepository.updateUser = jest.fn().mockResolvedValue(newTattoo);

            req.body.owner = req.params;
            await tattooController.createTattoo(
                req as Request,
                res as Response,
                next
            );

            expect(res.json).toHaveBeenCalledWith({ tattoos: newTattoo });
        });
    });

    describe('When updateTattoo is called', () => {
        test('Then updateTattoo return', async () => {
            userRepository.getUser = jest.fn().mockResolvedValue({
                id: '16',
                portfolio: [{ id: req.body.id }],
            });

            tattooRepository.updateTattoo = jest.fn().mockResolvedValue([]);

            userRepository.updateUser = jest
                .fn()
                .mockResolvedValue(mockUser.portfolio);

            await tattooController.updateTattoo(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('When deleteTattoo is called', () => {
        test('Then deleteTattoo return', async () => {
            req = {
                params: { id: '123' },
                body: { id: '14', owner: '12' },
            };
            userRepository.getUser = jest
                .fn()
                .mockResolvedValue({ portfolio: [{ _id: '14' }], id: '123' });

            tattooRepository.getTattoo = jest
                .fn()
                .mockResolvedValue({ id: '14', owner: { _id: '123' } });

            tattooRepository.deleteTattoo = jest.fn().mockResolvedValue({});
            userRepository.updateUser = jest
                .fn()
                .mockResolvedValue({ name: 'pepe' });

            await tattooController.deleteTattoo(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({
                updateUser: { name: 'pepe' },
            });
        });

        test('Then deleteTattoo return error', async () => {
            req = {
                params: { id: '123' },
                body: { id: '14', owner: '4851' },
            };
            userRepository.getUser = jest
                .fn()
                .mockResolvedValue({ portfolio: [{ _id: '14' }], id: '123' });

            tattooRepository.getTattoo = jest
                .fn()
                .mockResolvedValue({ id: '14', owner: { _id: '165' } });
            await tattooController.deleteTattoo(
                req as Request,
                res as Response,
                next
            );
            expect(next).toBeCalled();
        });
    });
});

describe('GIven TattooController returns error', () => {
    const error: CustomError = new HTTPError(
        404,
        'Not found id',
        'message of error'
    );

    const tattooRepository = TattooRepository.getInstance();
    const userRepository = UserRepository.getInstance();

    tattooRepository.getAllTattoo = jest.fn().mockReturnValue(error);
    tattooRepository.getTattoo = jest.fn().mockReturnValue('Tattoo');
    tattooRepository.updateTattoo = jest.fn().mockReturnValue(['Tattoo']);
    tattooRepository.createTattoo = jest.fn().mockReturnValue('Tattoo');
    tattooRepository.deleteTattoo = jest.fn().mockReturnValue('Tattoo');

    const tattooController = new TattooController(
        tattooRepository,
        userRepository
    );
    let req: Partial<Request> = {};
    const res: Partial<Response> = {
        json: jest.fn(),
    };

    const next: NextFunction = jest.fn();

    test('When getAllTattoo should return error', async () => {
        tattooRepository.getAllTattoo = jest.fn().mockRejectedValue('');
        await tattooController.getAllTattoo(
            req as Request,
            res as Response,
            next
        );
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
    });

    test('When getTattoo should return error', async () => {
        await tattooController.getTattoo(req as Request, res as Response, next);
        expect(error).toBeInstanceOf(HTTPError);
    });

    test('When createTattoo should return error', async () => {
        await tattooController.createTattoo(
            req as Request,
            res as Response,
            next
        );
        expect(error).toBeInstanceOf(HTTPError);
        expect(error).toBeInstanceOf(Error);
    });

    test('When updateTattoo should return error', async () => {
        req = { params: { id: '5' }, body: { id: '2', owner: '4' } };
        error.message = 'difference id';
        tattooRepository.updateTattoo = jest.fn().mockRejectedValue(error);
        await tattooController.updateTattoo(
            req as Request,
            res as Response,
            next
        );
        expect(error).toBeInstanceOf(HTTPError);
        expect(error).toBeInstanceOf(Error);
    });

    test('When deleteTattoo should return error', async () => {
        req = { params: { id: '5' }, body: { id: '2', owner: '4' } };
        error.message = 'difference id propertied';
        tattooRepository.deleteTattoo = jest.fn().mockRejectedValue(error);
        await tattooController.deleteTattoo(
            req as Request,
            res as Response,
            next
        );
        expect(error).toBeInstanceOf(HTTPError);
        expect(error).toBeInstanceOf(Error);
    });
});
