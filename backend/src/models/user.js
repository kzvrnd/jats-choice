import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

