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

router.use(cors(corsOptions));
router.options('*', cors(corsOptions));



router.post('/login', authController.loginPost);
router.post('/logout', authController.logoutPost);
router.post('/signup', authController.signupPost);
router.post('/checkauth', authController.checkAuthPost);
router.post('/refresh', authController.refreshPost);

export default router;