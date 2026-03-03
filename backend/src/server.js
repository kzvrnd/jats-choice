import express from 'express'
import userRoutes from './routes/user-routes.js';
 
const app = express();
const port = 3000;

app.use(express.json());



//routes
app.use('/', userRoutes);




app.listen(port, () => {
  console.log(`Server up! listening on port ${port}`);
});
