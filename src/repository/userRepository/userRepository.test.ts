import mongoose from 'mongoose';

import { dbConnect } from '../../dbConnect.js';
import { TattooRepository } from '../tattooRepository/tattooRepository.js';
import { UserRepository } from './userRepository.js';

describe('Given UserRepository', () => {
    const mockData = [
        {
            name: 'pepe',
            password: '123',
            email: 'pepe',
            image: 'pepe',
            favorites: [],
        },
        {
            name: 'coco',
            password: '456',
            email: 'coco',
            image: 'coco',
            favorites: [],
        },
    ];

    const repository = UserRepository.getInstance();
    TattooRepository.getInstance();
    let testIds: Array<string>;

    beforeAll(async () => {
        await dbConnect();
        await repository.getUserModel().deleteMany();
        await repository.getUserModel().insertMany(mockData);

        const data = await repository.getUserModel().find();
        testIds = [data[0].id, data[1].id];
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Given getUser is called', () => {
        test('Then getUser should return an user', async () => {
            const result = await repository.getUser(testIds[0]);
            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then getUser should return an error', () => {
            expect(async () => {
                await repository.getUser(testIds[9]);
            }).rejects.toThrowError();
        });
    });

    describe('Given createUser is called', () => {
        const newData = {
            name: 'luis',
            password: '789',
            email: 'luis',
            image: 'luis',
        };
        test('Then createUser should return', async () => {
            await repository.createUser(newData);
            expect(newData.name).toBe('luis');
        });

        test('Then createUser should return an error', () => {
            expect(async () => {
                await repository.createUser({ name: '' });
            }).rejects.toThrowError();
        });
    });

    describe('Given findUser is called', () => {
        test('Then findUser should return', async () => {
            const result = await repository.findUser({ name: 'pepe' });
            expect(result.name).toBe(mockData[0].name);
        });

        test('Then findUser should return an error name', () => {
            expect(async () => {
                const failName = '';
                await repository.findUser({ name: failName });
            }).rejects.toThrowError();
        });
    });

    describe('Given updateUserFavorites is called', () => {
        const updateName = 'jose';
        test('Then updateUserFavorites should return', async () => {
            const result = await repository.updateUser(testIds[0], {
                name: updateName,
            });
            expect(result.name).toEqual(updateName);
        });

        test('Then updateUserFavorites should return error', () => {
            expect(async () => {
                const invalidId = '537b422da27b69c98b1916e1';
                await repository.updateUser(invalidId, {
                    name: updateName,
                });
            }).rejects.toThrowError();
        });
    });

    describe('Given deleteUser is called', () => {
        test('Then deleteUser should return', async () => {
            const result = await repository.deleteUser(testIds[1]);
            expect(result).toEqual(testIds[1]);
        });

        test('Then deleteUser should return error', () => {
            expect(async () => {
                const invalidId = testIds[5];
                await repository.deleteUser(invalidId);
            }).rejects.toThrowError();
        });
    });
});
