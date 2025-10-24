import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import routes from './routes/routes.js'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
//import multer from 'multer';

dotenv.config({path: '../../.env'});
const app = express();
const PORT = 8080;

// app.use(cors({
//   origin: ['http://localhost:5173','http://localhost:8080'],
//   //origin: true,
//   credentials: true,
//   methods: ['GET','POST','OPTIONS','DELETE'],
//   allowedHeaders: ['Content-Type','Authorization']
// }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/api', routes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});