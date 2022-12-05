import { Request, Response, NextFunction } from 'express';
import {
    CustomError,
    HTTPError,
} from '../../interface/errorInterface/errorInterface';

import { TattooRepository } from '../../repository/tattooRepository/tattooRepository';
import { UserRepository } from '../../repository/userRepository/userRepository';
import { TattooController } from './tattooController';

const mockTattoo = [
    { id: '1', image: 'pepe' },
    { id: '2', image: 'coco' },
];

const newTattoo = { id: '3', image: 'maya' };

describe('Given TattooController', () => {
    let tattooRepository: TattooRepository;
    let userRepository: UserRepository;
    let tattooController: TattooController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        tattooRepository = TattooRepository.getInstance();
        userRepository = UserRepository.getInstance();

        tattooRepository.getTattoo = jest.fn().mockReturnValue(mockTattoo[0]);
        tattooRepository.getAllTattoo = jest.fn().mockReturnValue(['tattoo']);
        tattooRepository.createTattoo = jest.fn().mockReturnValue(newTattoo);
        tattooRepository.updateTattoo = jest
            .fn()
            .mockReturnValue(mockTattoo[0]);
        tattooRepository.deleteTattoo = jest.fn().mockReturnValue({});
        tattooController = new TattooController(
            tattooRepository,
            userRepository
        );

        req = {};
        res = {
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe('When getAllTattoo is called', () => {
        test('Then getAllTattoo should return tattoos', async () => {
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
            req.params = { id: '1' };
            req.body = newTattoo;
            await tattooController.getTattoo(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith(mockTattoo[0]);
        });
    });

    describe('When createTattoo is called', () => {
        test('should first', async () => {
            req.params = { id: '1' };
            req.body = mockTattoo;

            req.body.owner = req.params.id;
            await tattooController.createTattoo(
                req as Request,
                res as Response,
                next
            );

            expect(res.json).toHaveBeenCalledWith(newTattoo);
        });

        // test('should first', async () => {
        //     req.params = { id: '1' };
        //     req.body = { newTattoo };

        //     const user = req.params;
        // });
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

    const req: Partial<Request> = {};
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
    });

    test('When updateTattoo should return error', async () => {
        await tattooController.updateTattoo(
            req as Request,
            res as Response,
            next
        );
        expect(error).toBeInstanceOf(HTTPError);
    });
});
