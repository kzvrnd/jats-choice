import { Sequelize } from "sequelize";
import dotenv from "dotenv";


// load env variables
dotenv.config({ path: ".env.development" });


// export const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: process.env.DB_STORAGE || "./database.sqlite",
//   logging: false,
// });

// export const connectDB = async () => {
//   try{
//     // Just tests the connection does not create tables (sqlite file based so no real connection yet)
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully. ✅');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error); 
//     process.exit(1);
//   }
// }


export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

export const connectDB = async () => {
  try{
    // Just tests the connection does not create tables (sqlite file based so no real connection yet)
    await sequelize.authenticate();
    console.log('Connection has been established successfully. ✅');
  } catch (error) {
    console.error('Unable to connect to the database:', error); 
    process.exit(1);
  }
}
