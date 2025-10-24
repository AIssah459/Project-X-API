import { Router } from 'express';
import apiController from '../controllers/apiController.js'
import multer from 'multer';
import cors from 'cors';

const router = Router();

const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:8080', 'projectx-app.up.railway.app'],
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