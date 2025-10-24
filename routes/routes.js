import { Router } from 'express';
import apiController from '../controllers/apiController.js'
import multer from 'multer';
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


const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, '../../public/images');
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + '-' + file.originalname);
            },
            });
const upload = multer({ storage: storage,
                        fileFilter: (req, file, cb) => {
                            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                            cb(null, true);
                            } else {
                            cb(new Error('Invalid file type'));
                            }
                        }
    });

router.get('/events', cors(corsOptions), apiController.getEvents);
router.post('/events', cors(corsOptions), upload.single('file'), apiController.postEvents);
router.delete('/events/:id', cors(corsOptions), apiController.deleteEvents);
router.put('/events/:id', cors(corsOptions), upload.single('file'), apiController.updateEvents);

export default router;