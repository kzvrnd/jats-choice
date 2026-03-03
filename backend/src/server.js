import app from './app.js';
import { sequelize, connectDB } from './config/database.js'

 
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  // Creates/updates tables
  await sequelize.sync();
  console.log('All Tables synced ✅');

  app.listen(PORT, () => {
  console.log(`Server up! listening on port ${PORT}`);
  });

}


startServer();

