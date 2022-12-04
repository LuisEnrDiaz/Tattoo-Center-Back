import { Router } from 'express';

import { TattooController } from '../../controllers/tattooController/tattooController.js';
import { TattooRepository } from '../../repository/tattooRepository/tattooRepository.js';
import { UserRepository } from '../../repository/userRepository/userRepository.js';

export const tattooRoutes = Router();

const controller = new TattooController(
    TattooRepository.getInstance(),
    UserRepository.getInstance()
);

tattooRoutes.get('/', controller.getAllTattoo.bind(controller));
tattooRoutes.get('/:id', controller.getTattoo.bind(controller));
tattooRoutes.post('/:id', controller.createTattoo.bind(controller));
tattooRoutes.patch('/:id', controller.updateTattoo.bind(controller));
