import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import routes from './routes/routes.js'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
//import multer from 'multer';

dotenv.config({path: '../../.env'});
const app = express();
const PORT = process.env.PORT || 8080;

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

app.use(cors(corsOptions));
const isProduction = process.env.NODE_ENV === 'production';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/api', routes);

app.listen(PORT, isProduction ? '0.0.0.0' : 'localhost',() => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});