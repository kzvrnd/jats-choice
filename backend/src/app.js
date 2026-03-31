import express from 'express'
import userRoutes from './routes/user-routes.js';
import authRoutes from './routes/auth-routes.js';
import jobRoutes from './routes/job-routes.js';
import 'dotenv/config.js';
import cookieParser from 'cookie-parser';


const app = express();


//middleware
app.use(express.json());
app.use(cookieParser());



//routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);








export default app;