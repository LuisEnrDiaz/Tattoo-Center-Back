import { Router } from 'express';
import { UserController } from '../../controllers/userController/userController.js';
import { UserRepository } from '../../repository/userRepository/userRepository.js';

export const userRoutes = Router();

const controller = new UserController(UserRepository.getInstance());

userRoutes.post('/register', controller.register.bind(controller));
userRoutes.post('/login', controller.login.bind(controller));
userRoutes.delete('/:id', controller.delete.bind(controller));
