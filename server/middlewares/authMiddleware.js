import Jwt from "jsonwebtoken";
import studentModel from "../models/studentModel.js";
import tuitionModel from "../models/tuitionModel.js";


//Protected Routes Token Bases
export const requireSignIn = (req,res,next) => {
    try {
        const decode = Jwt.verify(
            req.headers.authorization,
            process.env.JSONWEBTOKENKEY
        );

        req.students = decode;
        req.tuition = decode;

        next();
    } catch (err) {
        console.log(err);
    }
}

//check tuition subscription 
export const isTutionSubscribed =async (req, res, next) => {
    try {
        const tuition = await tuitionModel.findById(req.tuition._id)
        if (tuition.subscribed === false || !tuition.subscribed) {
            return res.status(401).send({
                success:false,
                message: "You are not subscribed to this tuition"
            })
        } else {
            next();
        }
    } catch(error) {
        console.log(error);
         res.status(201).send({
           success: false,
             message: "Error in checking subscription",
           error
         });
    }
}

//check student confirmation
export const isStudentConfirmed = async (req, res, next) => {
  try {
    const students = await studentModel.findById(req.students._id);
    if (students.confirm === false || !students.confirm) {
      return res.status(200).send({
        success: false,
        message: "You are not confirmed",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(201).send({
      success: false,
      message: "Error in student cofirmation checking",
      error,
    });
  }
};

