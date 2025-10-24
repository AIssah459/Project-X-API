import { Router } from 'express';
import authController from '../controllers/authController.js';
import cors from 'cors';

const router = Router();

const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:8080', 'https://projectx-app.up.railway.app', 'https://projectxapp.netlify.app'],
  //origin: true,
  credentials: true,
  methods: ['GET','POST','OPTIONS','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
};

const publicCors = cors({
  origin: ['http://localhost:5173','http://localhost:8080', 'https://projectx-app.up.railway.app', 'https://projectxapp.netlify.app/'],
  credentials: false, // 👈 No cookie required
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

router.post('/login', cors(corsOptions), authController.loginPost);
router.post('/logout', cors(corsOptions), authController.logoutPost);
router.post('/signup', publicCors, authController.signupPost);
router.post('/checkauth', cors(corsOptions), authController.checkAuthPost);
router.post('/refresh', cors(corsOptions), authController.refreshPost);

export default router;