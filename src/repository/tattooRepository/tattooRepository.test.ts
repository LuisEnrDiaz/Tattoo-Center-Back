import mongoose from 'mongoose';

import { dbConnect } from '../../dbConnect';
import { UserRepository } from '../userRepository/userRepository';
import { TattooRepository } from './tattooRepository';

describe('Given TattooRepository', () => {
    const mockData = [
        {
            image: 'pepe',
            link: 'pepe',
        },
        {
            image: 'coco',
            link: 'coco',
        },
    ];

    const repository = TattooRepository.getInstance();
    UserRepository.getInstance();
    let testIds: Array<string>;

    beforeAll(async () => {
        await dbConnect();
        await repository.getTattooModel().deleteMany();
        await repository.getTattooModel().insertMany(mockData);

        const data = await repository.getTattooModel().find();
        testIds = [data[0].id, data[1].id];
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Given getAllTattoo is called', () => {
        test('Then getAllTattoo return', async () => {
            const result = await repository.getAllTattoo();
            expect(result[0].image).toEqual(mockData[0].image);
        });
    });

    describe('Given getTattoo is called', () => {
        test('Then getTattoo return', async () => {
            const result = await repository.getTattoo(testIds[0]);

            expect(result.link).toEqual(mockData[0].link);
        });

        test('Then getTattoo return error', () => {
            expect(async () => {
                await repository.getTattoo(testIds[485]);
            }).rejects.toThrowError();
        });

        test('Then getTattoo return id fail', () => {
            expect(async () => {
                await repository.getTattoo('678a19943b803213a758ebc7');
            });
        });
    });

    describe('Given createTattoo is called', () => {
        const newData = { image: 'maya', link: 'maya' };
        test('Then createTattoo return', async () => {
            const result = await repository.createTattoo(newData);
            expect(result.image).toEqual(newData.image);
        });
    });

    describe('Given updateTattoo is called', () => {
        const updateData = { image: 'pepito' };
        test('Then updateTattoo return', async () => {
            const result = await repository.updateTattoo(
                testIds[0],
                updateData
            );

            expect(result.image).toEqual(updateData.image);
        });

        test('Then updateTattoo return error', () => {
            expect(async () => {
                await repository.updateTattoo(testIds[18], {});
            }).rejects.toThrowError();
        });
    });
});
