import JWT from "jsonwebtoken";
import tuitionModel from "../models/tuitionModel.js";
import studentModel from "../models/studentModel.js";
import qnaModel from "../models/qnaModel.js";
import feesModal from "../models/feesModal.js";

//get student details controller

export const getStudentDetailsController = async (req, res) => {
  try {
    const { token } = req.params;
    // console.log(token)
    const id = JWT.verify(token, process.env.JSONWEBTOKENKEY);
    // console.log(id)
    const student = await studentModel.findOne({ _id: id });
    // console.log(student)
    res.status(200).send({
      success: true,
      message: "Fetched Successfully",
      student,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in server",
      err,
    });
  }
};
//get tuintion-details
export const getTuitionDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)
    const tuition = await tuitionModel.findOne({ _id: id });
    res.status(200).send({
      success: true,
      message: "Fetched Successfully",
      tuition,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in server",
      err,
    });
  }
};

//update studentiya profile
export const updateStudentProfileController = async (req, res) => {
  try {
    const { name, email, address, phone_number } = req.body;
    const student = await studentModel.findOneAndUpdate({ email }, { name, address, phone_number }, { new: true });
    res.status(200).send({
      success: true,
      message: "Updated Successfully",
      student
    })
    
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Updating",
      error,
    });
  }
}

//delete student account
export const deleteStudentAccountController = async (req,res) => {
  try {
    const {email} = req.params
    const student = await studentModel.findOneAndDelete({ email })   
    res.status(200).send({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Account",
      error,
    });
  }
}

//submit question controller

export const questionSubmitController = async(req,res)=>{
  try{
    console.log(req.body)
    const {student_id,name,email,tuition_db_id,que} = req.body
    console.log(student_id, name, email, tuition_db_id, que);
    const isquestion = await new qnaModel({
      student_name:name,
      student_email:email,
      student_id,
      tuition_db_id,
      question:que
    }).save();
    console.log(isquestion)
    res.status(201).send({
      success: true,
      message: "Question Submitted",
      isquestion,
    });
  }
  catch(error){
    res.status(500).send({
      success: false,
      message: "Error in submiting question",
      error,
    });
  }
}

//get all question of particular students

export const getAllQuestionController = async(req,res)=>{
  try{
    const {token} = req.params
    const id = JWT.verify(token,process.env.JSONWEBTOKENKEY)
    // console.log(id)
    const questions = await qnaModel.find({$or: [{student_id:id},{tuition_db_id:id}]})
    // console.log(questions)
    res.status(200).send(
      {
        success: true,
        message: "Question Submitted",
        questions,
      },
    );
  }catch(error){
    res.status(500).send({
      success: false,
      message: "Error in Deleting Account",
      error,
    });
  }
}

export const getFeesDetailsController = async (req, res) => {
  try {
    const { student_id,tuition_id } = req.body;
    // console.log(student_id, tuition_id);
    const student = await feesModal.findOne({ student_id, tuition_id });
    if (student) {
     res.status(200).send({
       success: true,
       message: "Fetched Successfully",
       student,
     }); 
    } else {
      res.status(201).send({
        success: false,
        message: "No Data Found",
        student,
      });
    }
    // console.log(student);
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in server",
      err,
    });
  }
}

//update fees status
export const updateFeesStatusController = async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email);
      const student = await studentModel.findOneAndUpdate(
        { email },
        { feesStatus: "Paid" },
        { new: true }
      );
      console.log(student);
      res.status(200).send({
        success: true,
        message: "Updated Successfully",
        student,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error in Updating",
        error,
      });
    }
}

//update fees status pending
export const updateFeesStatusPendingController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const student = await studentModel.findOneAndUpdate(
      { email },
      { feesStatus: "Pending" },
      { new: true }
    );
    console.log(student);
    res.status(200).send({
      success: true,
      message: "Updated Successfully",
      student,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Updating",
      error,
    });
  }
};