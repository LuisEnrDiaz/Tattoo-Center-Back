import { Router } from 'express';

import { UserController } from '../../controllers/userController/userController.js';
import { logged } from '../../middleware/interceptors/interceptors.js';
import { TattooRepository } from '../../repository/tattooRepository/tattooRepository.js';
import { UserRepository } from '../../repository/userRepository/userRepository.js';

export const userRoutes = Router();

const controller = new UserController(
    UserRepository.getInstance(),
    TattooRepository.getInstance()
);

userRoutes.get('/:id', controller.getUser.bind(controller));
userRoutes.post('/register', controller.register.bind(controller));
userRoutes.post('/login', controller.login.bind(controller));
userRoutes.patch(
    '/addTattooFavorites',
    logged,
    controller.addTattooFavorites.bind(controller)
);
userRoutes.patch(
    '/deleteTattooFavorites',
    logged,
    controller.deleteTattooFavorites.bind(controller)
);
userRoutes.delete('/', logged, controller.deleteUser.bind(controller));
