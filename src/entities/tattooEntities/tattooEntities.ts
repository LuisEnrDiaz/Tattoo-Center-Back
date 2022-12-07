import { model, Schema, Types } from 'mongoose';

export type TattooI = {
    id: Types.ObjectId;
    image: string;
    categories: Array<Category>;
    link: string;
    owner: Types.ObjectId;
};

export type ProtoTattooI = {
    image: string;
    categories: Array<Category>;
    link: string;
    owner: Types.ObjectId;
};

type Category =
    | 'TRADITIONAL'
    | 'OLD SCHOOL'
    | 'TRIBAL'
    | 'REALISM'
    | 'JAPANESE'
    | 'BLACK & GREY';

export const tattooSchema = new Schema<TattooI>({
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
    },
});

export const Tattoo = model<TattooI>('Tattoo', tattooSchema, 'tattoos');
