import { sequelize } from "../src/config/database.js";

beforeEach(async () => {
  await sequelize.sync({ force: true });
});


afterAll(async () => {
  await sequelize.close();
});