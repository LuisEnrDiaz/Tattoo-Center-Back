import { model, ObjectId, Schema, Types } from 'mongoose';

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
    categories: {
        type: [String],
    },

    link: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

tattooSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.passwd;
    },
});

export const Tattoo = model<TattooI>('Tattoo', tattooSchema, 'tattoos');
