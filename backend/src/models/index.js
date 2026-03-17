import { User } from "./user.js";
import { Job } from "./job.js";

User.hasMany(Job, { foreignKey: "userId" });
Job.belongsTo(User, { foreignKey: "userId" });



export {
  User,
  Job
};
