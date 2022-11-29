import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { setCors } from './middleware/corsMiddleware/corsMiddleware.js';
import { errorManager } from './middleware/errorMiddleware/errorMiddleware.js';

export const app = express();

app.disable('x-powered-by');

const corsOptions = {
    origin: '*',
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use(setCors);

app.get('/', (req, res) => {
    res.send(
        'Bienvenido a mi Api de Tattoo Center puedes navegar por: /tattoos o /users'
    );
});

app.use(errorManager);
