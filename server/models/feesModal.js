import mongoose from "mongoose";

const feesSchema = new mongoose.Schema(
  {
    payment: {},
    tuition_id: {
      type: String,
      default: "",
    },
    student_id: {
      type: String,
      default: "",
    },
    fees: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);
export default mongoose.model("fees", feesSchema);