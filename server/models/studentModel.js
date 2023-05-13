import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: Number,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      trim: true,
    },
    standard: {
      type: Number,
      required: true,
      trim: true,
    },
    tuition_class_name: {
      type: String,
      required: true,
      trim: true,
    },
    tuition_id: {
      type: String,
      required: true,
      trim: true,
    },
    student_id: {
      type: String,
      required: true,
      trim: true,
    },
    tuition_db_id: {
      type: mongoose.ObjectId,
      ref: "tuition",
      required: true,
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: "",
    },
    feesPerMonth: {
      type: String,
      default: "0",
    },
    feesStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending","Paid"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("students", studentSchema);
