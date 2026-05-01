import express from 'express'
import userRoutes from './routes/user-routes.js';
import authRoutes from './routes/auth-routes.js';
import jobRoutes from './routes/job-routes.js';
import 'dotenv/config.js';
import cookieParser from 'cookie-parser';

import errorHandler from './middleware/error-handler.js';


const app = express();


//middleware
app.use(express.json());
app.use(cookieParser());



//routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);


//error middleware must be last middleware
app.use(errorHandler);





export default app;