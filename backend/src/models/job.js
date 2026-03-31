import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./user.js";

export const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { 
      notEmpty: true 
    }    
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }   
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salaryMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isValidSalaryRange() {
        if (this.salaryMax && this.salaryMin > this.salaryMax) {
          throw new Error("salaryMin must be less than or equal to salaryMax");
        }
      }
    }
  },
  salaryMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(
      'saved',
      'applied',
      'interview',
      'rejected',
      'offer'
    ),
    allowNull: true,
    defaultValue: 'pending',
  },
  employmentType: {
    type: DataTypes.ENUM(
      'full-time',
      'part-time',
      'contract',
      'internship',
      'volunteer',
      'temporary'
    ),
    allowNull: true,
    defaultValue: 'full-time',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }

});



