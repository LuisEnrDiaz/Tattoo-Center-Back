import { model, Schema, Types } from 'mongoose';

export type UserI = {
    id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    image: string;
    favorites: Array<Types.ObjectId>;
    portfolio: Array<Types.ObjectId>;
    description: string;
    tattoo: Types.ObjectId;
};

export type ProtoUserI = {
    name: string;
    email: string;
    password: string;
    image: string;
    favorites: Array<Types.ObjectId>;
    portfolio: Array<Types.ObjectId>;
    description: string;
    tattoo: Types.ObjectId;
};

export const userSchema = new Schema<UserI>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    favorites: [
        {
            type: Types.ObjectId,
            ref: 'Tattoo',
        },
    ],
    portfolio: [
        {
            type: Types.ObjectId,
            ref: 'Tattoo',
        },
    ],
    description: {
        type: String,
    },
    tattoo: {
        type: Schema.Types.ObjectId,
        ref: 'Tattoo',
    },
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.passwd;
    },
});

export const User = model<UserI>('User', userSchema, 'users');
