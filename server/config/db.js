import mongoose from "mongoose";
const connectionDB = async () => {
  try {
    const conn =await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
};
export default connectionDB