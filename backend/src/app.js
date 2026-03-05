import express from 'express'
import userRoutes from './routes/user-routes.js';
import 'dotenv/config.js';



const app = express();


//middleware
app.use(express.json());


//routes
app.use('/api/auth', userRoutes);

export default app;