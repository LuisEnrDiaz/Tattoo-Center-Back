import mongoose from 'mongoose';
import { dbConnect } from '../../dbConnect.js';
import { UserRepository } from './userRepository.js';

describe('Given UserRepository', () => {
    const mockData = [
        { name: 'pepe', password: '123', email: 'pepe', image: 'pepe' },
        { name: 'coco', password: '456', email: 'coco', image: 'coco' },
    ];

    const repository = UserRepository.getInstance();
    let testIds: Array<string>;

    beforeAll(async () => {
        await dbConnect();
        await repository.getUserModel().deleteMany();
        await repository.getUserModel().insertMany(mockData);

        const data = await repository.getUserModel().find();
        testIds = [data[0].id, data[1].id];
    });

    afterAll(async () => {
        mongoose.disconnect();
    });

    describe('Given get is called', () => {
        test('Then get should return an user', async () => {
            const result = await repository.get(testIds[0]);
            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then get should return an error', () => {
            expect(async () => {
                await repository.get(testIds[9]);
            }).rejects.toThrowError();
        });
    });

    describe('Given post is called', () => {
        const newData = {
            name: 'luis',
            password: '789',
            email: 'luis',
            image: 'luis',
        };
        test('Then post should return', async () => {
            await repository.post(newData);
            expect(newData.name).toBe('luis');
        });

        test('Then post should return an error', () => {
            expect(async () => {
                await repository.post({ name: '' });
            }).rejects.toThrowError();
        });
    });

    describe('Given find is called', () => {
        test('Then find should return', async () => {
            const result = await repository.find({ name: 'pepe' });
            expect(result.name).toBe(mockData[0].name);
        });

        test('Then find should return an error name', () => {
            expect(async () => {
                const failName = '';
                await repository.find({ name: failName });
            }).rejects.toThrowError();
        });
    });

    describe('Given patch is called', () => {
        const updateName = 'jose';
        test('Then patch should return', async () => {
            const result = await repository.patch(testIds[1], {
                name: updateName,
            });
            expect(result.name).toEqual(updateName);
        });

        test('Then patch should return error', () => {
            expect(async () => {
                const invalidId = '537b422da27b69c98b1916e1';
                await repository.patch(invalidId, {
                    name: updateName,
                });
            }).rejects.toThrowError();
        });

        describe('Given delete is called', () => {
            test('Then delete should return', async () => {
                const result = await repository.delete(testIds[1]);
                expect(result).toEqual(testIds[1]);
            });

            test('Then delete should return error', () => {
                expect(async () => {
                    const invalidId = '537b422da27b69c98b1916e1';
                    await repository.delete(invalidId);
                }).rejects.toThrowError();
            });
        });
    });
});
