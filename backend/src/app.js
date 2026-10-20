import express from 'express'
import cors from 'cors'
import userRoutes from './routes/user-routes.js';
import authRoutes from './routes/auth-routes.js';
import jobRoutes from './routes/job-routes.js';
import { errorHandler } from './middleware/error-handler.js';


import 'dotenv/config.js';
import cookieParser from 'cookie-parser';



const app = express();


//middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());



//routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);


//error middleware must be last middleware
app.use(errorHandler);





export default app;