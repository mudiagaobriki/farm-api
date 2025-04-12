import { Router } from 'express';
import ProfileControllerFactory from '../controller/ProfileController.js';

const profileRouter = Router();
const ProfileController = ProfileControllerFactory();

// Define routes for profile management
profileRouter.post('/new', ProfileController.newProfile);
profileRouter.get('/all/:page/:perPage', ProfileController.allProfiles);
profileRouter.get('/:id', ProfileController.selectProfile);
profileRouter.post('/edit', ProfileController.editProfile);

export default profileRouter;
