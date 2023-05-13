import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default:""
    }
  },
);
export default mongoose.model("admin", adminSchema);
