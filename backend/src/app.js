import express from 'express'
import userRoutes from './routes/user-routes.js';
import 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './middleware/auth-middleware.js';

const app = express();


//middleware
app.use(express.json());
app.use(cookieParser());


//routes
app.use('/api/auth', userRoutes);


app.get('/api/auth/private', authenticate, (req, res) => {
  res.send('This is a private route.');
}); 


export default app;