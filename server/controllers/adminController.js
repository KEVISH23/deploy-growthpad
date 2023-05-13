import adminModel from "../models/adminModel.js";
import studentModel from "../models/studentModel.js"
import tuitionModel from "../models/tuitionModel.js"
import { comparePassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";
//adminLoginController
export const adminLoginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username && !password) {
      return res.send({
        success: false,
        message: "All Fields are required",
      });
    }
    let adminCheck = await adminModel.findOne({ username });
    if (!adminCheck) {
      return res.status(200).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const match = await comparePassword(password, adminCheck.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = JWT.sign(
      { _id: adminCheck._id },
      process.env.JSONWEBTOKENKEY
    );
    const addToken = await adminModel.findByIdAndUpdate(
      adminCheck._id,
      { token },
      );
    res.status(201).send({
      success: true,
      message: "Login Succesfully",
      adminCheck,
      token,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in registration",
      err,
    });
  }
};

//all tuition details
export const allTuitionDetailsController = async (req, res) => {
  try {
    const allTuitions = await tuitionModel.find({})
    res.status(200).send({
      success: true,
      allTuitions
    })
  } catch(error) {
    res.status(500).send({
      success: false,
      message: "Error ...",
      err,
    });
  }
}

//all student details
export const allStudentsDetailsController = async (req, res) => {
   try {
     const allStudents = await studentModel.find({});
     res.status(200).send({
       success: true,
       allStudents,
     });
   } catch (error) {
     res.status(500).send({
       success: false,
       message: "Error ...",
       err,
     });
   }
}