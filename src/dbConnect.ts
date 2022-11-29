import mongoose from 'mongoose';

import { USER, PASSWD } from './config.js';

export function dbConnect() {
    const DBName =
        process.env.NODE_ENV !== 'test'
            ? 'FinalProject'
            : 'FinalProjectTesting';
    let uri = `mongodb+srv://${USER}:${PASSWD}`;
    uri += `@cluster0.biz1mts.mongodb.net/${DBName}?retryWrites=true&w=majority`;

    return mongoose.connect(uri);
}
