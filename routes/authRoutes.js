import { Router } from 'express';
import authController from '../controllers/authController.js';
import cors from 'cors';

const router = Router();

router.post('/login', authController.loginPost);
router.post('/logout', authController.logoutPost);
router.post('/signup', authController.signupPost);
router.post('/checkauth', authController.checkAuthPost);
router.post('/refresh', authController.refreshPost);

export default router;