import mongoose from "mongoose";

const tuitionSchema = new mongoose.Schema(
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
    tuition_class_name: {
      type: String,
      required: true,
      trim: true,
    },
    tuition_address: {
      type: String,
      required: true,
      trim: true,
    },
    tuition_id: {
      type: String,
      required: true,
      trim: true,
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model('tuition',tuitionSchema);