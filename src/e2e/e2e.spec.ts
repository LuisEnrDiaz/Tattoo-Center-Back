import mongoose from 'mongoose';
import { dbConnect } from '../dbConnect';
import request from 'supertest';

import { Tattoo } from '../entities/tattooEntities/tattooEntities.js';
import { User } from '../entities/userEntities/userEntities.js';
import { createToken, TokenPayload } from '../services/auth/auth.js';
import { app } from '../app.js';

const dataBase = async () => {
    const mockPass = '123';
    const mockUser = [
        {
            name: 'pepe',
            email: 'pepe.com',
            image: 'pepeImage',
            password: '123',
            favorites: [],
            portfolio: [],
            description: '',
        },
        {
            name: 'maya',
            email: 'maya.com',
            image: 'mayaImage',
            password: '123',
            favorites: [],
            portfolio: [],
            description: '',
        },
    ];

    const mockTattoo = [
        {
            image: 'imagePepe',
            categories: [],
            link: '',
            owner: '638efa1d62f2e976a1b53d33',
        },
        {
            image: 'imageMaya',
            categories: [],
            link: '',
            owner: '638efa1d62f2e976a1b53d33',
        },
    ];

    await User.deleteMany();
    await User.insertMany(mockUser);
    await Tattoo.deleteMany();
    await Tattoo.insertMany(mockTattoo);

    const dataUser = await User.find();
    const dataTattoo = await Tattoo.find();

    const testIdsUser = [dataUser[0].id, dataUser[1].id];
    const testIdsTattoos = [dataTattoo[0].id, dataTattoo[1].id];

    return testIdsUser && testIdsTattoos;
};

describe('Given "app" with "/tattoos" route', () => {
    describe('When I have connection to mongoDB', () => {
        let token: string;
        let ids: Array<string>;

        beforeEach(async () => {
            await dbConnect();
            ids = await dataBase();

            const payload: TokenPayload = {
                name: 'coco',
            };

            token = createToken(payload);
        });

        afterEach(async () => {
            await mongoose.disconnect();
        });

        describe('When it calls the get "/tattoos"', () => {
            test('Then should return status 200', async () => {
                const response = await request(app).get('/tattoos');
                expect(response.status).toBe(200);
            });
        });

        describe('when it calls the get to url /tattoos/:id', () => {
            test('then if id is invalid, it sends status 403', async () => {
                const response = await request(app).get('/albums/23');
                expect(response.status).toBe(404);
            });
        });

        describe('when it calls the post to url /tattoos/:id', () => {
            test('then if user is not authorize, it sends status 403', async () => {
                const response = await request(app)
                    .post('/tattoos/')
                    .send({ image: 'createdTattoo' });
                expect(response.status).toBe(404);
            });
        });
    });
});
