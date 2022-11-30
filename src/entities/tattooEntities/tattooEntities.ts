import { ObjectId, Schema, Types } from 'mongoose';

export type TattooI = {
    id: ObjectId;
    image: string;
    categories: Array<Category>;
    link: string;
    owner: ObjectId;
};

export type ProtoTattooI = {
    image: string;
    categories: Array<Category>;
    link: string;
    owner: ObjectId;
};

type Category =
    | 'TRADITIONAL'
    | 'Old SCHOOL'
    | 'TRIBAL'
    | 'REALISM'
    | 'JAPANESE'
    | 'BLACK & GREY';

export const tattooSchema = new Schema<TattooI>({
    id: {
        type: Types.ObjectId,
    },
    image: {
        type: String,
        required: true,
    },
    categories: [
        {
            type: Array<Category>,
            require: true,
        },
    ],
    link: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
});
