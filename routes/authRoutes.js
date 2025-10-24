import { Router } from 'express';
import authController from '../controllers/authController.js';
import cors from 'cors';

const router = Router();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'https://projectx-app.up.railway.app',
  'https://project-x-20h.pages.dev'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS request origin:', origin);
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  //origin: true,
  credentials: true,
  methods: ['GET','POST','OPTIONS','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
};

const publicCors = cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    console.log('CORS request origin:', origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false, // 👈 No cookie required
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

router.post('/login', publicCors, authController.loginPost);
router.post('/logout', cors(corsOptions), authController.logoutPost);
router.post('/signup', publicCors, authController.signupPost);
router.post('/checkauth', cors(corsOptions), authController.checkAuthPost);
router.post('/refresh', cors(corsOptions), authController.refreshPost);

export default router;