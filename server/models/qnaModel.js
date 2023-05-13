import mongoose from "mongoose";

const qnaSchema = new mongoose.Schema(
  {
    student_name: {
      type: String,
      required: true,
      trim: true,
    },
    student_email: {
      type: String,
      required: true,
      trim: true,
    },
    student_id: {
      type: mongoose.ObjectId,
      ref: "student",
      required: true,
    },
    tuition_db_id: {
      type: mongoose.ObjectId,
      ref: "tuition",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("qna", qnaSchema);
