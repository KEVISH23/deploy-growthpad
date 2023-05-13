import { passwordHashing,comparePassword,generateStudentId,generateTuitionId } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";
import tuitionModel from "../models/tuitionModel.js";
import studentModel from "../models/studentModel.js";
import qnaModel from "../models/qnaModel.js";
import orderModel from "../models/orderModel.js"
//Tuition register controlleer

export const registerController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      phone_number,
      tuition_class_name,
      tuition_address,
    } = req.body;
    if (
      !name &&
      !email &&
      !password &&
      !address &&
      !phone_number &&
      !tuition_class_name &&
      !tuition_address
    ) {
      return res.send({
        success: false,
        message: "All Fields are required",
      });
    }
    //existing tuition
    const existingTuition = await tuitionModel.findOne({ email });

    if (existingTuition) {
      return res.status(200).send({
        success: false,
        message: "Already Register",
      });
    }
    const hashPassword = await passwordHashing(password);
    //genrating tuition id
    const tuitionlen = await tuitionModel.find({});
    const length = tuitionlen.length;
    const tuition_id = await generateTuitionId(length, tuition_class_name);
    const tuition = await new tuitionModel({
      name,
      email,
      password: hashPassword,
      address,
      phone_number,
      tuition_class_name,
      tuition_address,
      tuition_id,
    }).save();
    res.status(201).send({
      success: true,
      message: "Registered Succesfully",
      tuition,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in registration",
      err,
    });
  }
};

//Tuition login controller\
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.send({
        success: false,
        message: "All fields are required",
      });
    }
    let userExist = await tuitionModel.findOne({ email });
    if (!userExist) {
      return res.status(200).send({
        success: false,
        message: "Please Register Before Login",
      });
    }
    const match = await comparePassword(password, userExist.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Password does not match",
      });
    }
    const token = JWT.sign({ _id: userExist._id }, process.env.JSONWEBTOKENKEY);
    const addToken = await tuitionModel.findByIdAndUpdate(
      userExist._id,
      { token },
      { new: true }
    );
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   expires: new Date(Date.now() + 2589200000),
    // });
    return res.status(200).send({
      success: true,
      message: "Login Successfull",
      user: {
        name: userExist.name,
        email: userExist.email,
        phone_number: userExist.phone_number,
        tuition_id: userExist.tuition_id,
        tuition_class_name: userExist.tuition_class_name,
        address: userExist.address,
        tuition_address: userExist.tuition_address,
        _id: userExist._id,
        subscribed: userExist.subscribed,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      err,
    });
  }
};

//Student Register Controller

export const stdRegisterController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      phone_number,
      standard,
      tuition_class_name,
      tuition_id,
      age,
    } = req.body;
    if (
      !name &&
      !email &&
      !password &&
      !address &&
      !phone_number &&
      !tuition_class_name &&
      !tuition_id &&
      !age &&
      !standard
    ) {
      return res.send({
        success: false,
        message: "All Fields are required",
      });
    }
    //find existing student
    const existingStudent = await studentModel.findOne({ email });
    if (existingStudent) {
      return res.status(200).send({
        success: false,
        message: "Already Register",
      });
    }
    const tuitionDetails = await tuitionModel.findOne({
      tuition_id,
      tuition_class_name,
    });
    if (!tuitionDetails) {
      return res.status(200).send({
        success: false,
        message: "No such classes found",
      });
    }
    const tuition_db_id = tuitionDetails._id;
    const hashpass = await passwordHashing(password);
    const student_id = await generateStudentId(name, tuition_id);

    const student = await new studentModel({
      name,
      email,
      password: hashpass,
      address,
      phone_number,
      standard,
      tuition_class_name,
      tuition_id,
      tuition_db_id,
      student_id,
      age,
    }).save();
    return res.status(201).send({
      success: true,
      message: "Register Succesfully",
      student,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      err,
    });
  }
};

//Student Login Controller

export const studentLoginController = async (req, res) => {
  try {
    const { student_id, email, password } = req.body;
    if (!student_id && !email && !password) {
      return res.send({
        success: false,
        message: "All fields requred",
      });
    }
    let studentExist = await studentModel.findOne({ email, student_id });
    if (!studentExist) {
      return res.status(200).send({
        success: false,
        message: "Please Register before login",
      });
    }
    if (studentExist.confirm) {
      const match = await comparePassword(password, studentExist.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      const token = JWT.sign(
        { _id: studentExist._id },
        process.env.JSONWEBTOKENKEY
      );
      const addToken = await studentModel.findByIdAndUpdate(
        studentExist._id,
        { token },
        { new: true }
      );
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 2589200000),
      });
      return res.status(200).send({
        success: true,
        message: "Login Successfull",
        user: {
          name: studentExist.name,
          email: studentExist.email,
          phone_number: studentExist.phone_number,
          student_id: studentExist.student_id,
          standard: studentExist.standard,
          tuition_class_name: studentExist.tuition_class_name,
          address: studentExist.address,
          tuition_id: studentExist.tuition_id,
          _id: studentExist._id,
          confirm: studentExist.confirm,
        },
        token,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "Confirmation pending by tuition class",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      err,
    });
  }
};

// test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//studentTestController
export const studentTestController = (req, res) => {
  try {
    res.send("Welcome Confirmed Student :->");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// get all Student list
export const getStudentController = async (req, res) => {
  try {
    const { token } = req.params;
    const _id = JWT.verify(token, process.env.JSONWEBTOKENKEY);
    // console.log(_id);
    const students = await studentModel.find({ tuition_db_id: _id });
    res.status(200).send({
      success: true,
      message: "Successfully Getted",
      students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting students lists",
    });
  }
};

// put  confirm student
export const confirmStudentController = async (req, res) => {
  try {
    const { modalFees } = req.body;
    const { id } = req.params;
    // console.log(modalFees,id);
    const student = await studentModel.findByIdAndUpdate(
      { _id: id },
      { confirm: true, feesPerMonth: modalFees },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: student.confirm ? "Fees Updated" : " Confirmed Successfully",
      student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Confirming Student",
    });
  }
};

//delete  discrad student
export const removeStudentController = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: " Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Confirming Student",
    });
  }
};

//verifying tuition || token based
export const authTuitionController = async (req, res) => {
  try {
    const { token } = req.params;
    // console.log(token);
    const id = JWT.verify(token, process.env.JSONWEBTOKENKEY);
    const tuition = await tuitionModel.findOne({ _id: id });
    res.status(200).send({
      user: {
        id: tuition._id,
        name: tuition.name,
        email: tuition.email,
        address: tuition.address,
        phone_number: tuition.phone_number,
        tuition_class_name: tuition.tuition_class_name,
        tuition_address: tuition.tuition_address,
        subscribed: tuition.subscribed,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error ....",
    });
  }
};

// put  || update tuition profile
export const updateTuitionProfileController = async (req, res) => {
  try {
    const {
      id,
      name,
      email,
      address,
      phone_number,
      tuition_class_name,
      tuition_address,
    } = req.body;
    // console.log(email);
    // const tuition = await tuitionModel.findOne({email})
    const student = await studentModel.findOneAndUpdate(
      { tuition_db_id: id },
      {
        tuition_class_name,
      },
      { new: true }
    );
    const tuition = await tuitionModel.findOneAndUpdate(
      { email },
      {
        name,
        address,
        phone_number,
        tuition_class_name,
        tuition_address,
      },
      { new: true }
    );
    // console.log(tuition);
    res.status(200).send({
      success: true,
      message: " Updated Successfully",
      user: {
        name: tuition.name,
        email: tuition.email,
        address: tuition.address,
        phone_number: tuition.phone_number,
        tuition_class_name: tuition.tuition_class_name,
        tuition_address: tuition.tuition_address,
        subscribed: tuition.subscribed,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Updating...",
    });
  }
};

// get || tuition details
export const getTuitionDetailController = async (req, res) => {
  try {
    const { token } = req.params;
    // console.log(token);
    const id = JWT.verify(token, process.env.JSONWEBTOKENKEY);
    const tuition = await tuitionModel.findOne({ _id: id });
    res.status(200).send({
      success: true,
      message: "Fetched Successfully",
      tuition,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In Fetching Details...",
    });
  }
};
//delete tuition profile
export const deleteTuitionProfileController = async (req, res) => {
  try {
    const { email } = req.params;
    const tuition = await tuitionModel.findOneAndDelete({ email });
    const tuition_db_id = tuition._id;
    const students = await studentModel.deleteMany({ tuition_db_id });
    res.status(200).send({
      success: true,
      message: "Deleted Successfully",
      tuition,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Account",
      error,
    });
  }
};

//get || filtered students (dropdown based)
export const getFilteredStudentsController = async (req, res) => {
  try {
    const { token } = req.params;
    const { confirm, standard, name } = req.body;
    const _id = JWT.verify(token, process.env.JSONWEBTOKENKEY);
    // console.log(_id,req.body);
    if (confirm === "None" && standard === "None" && name === "") {
      res.status(200).send({
        success: false,
        message: "No Filter Applied",
      });
    } else if (confirm !== "None" && standard === "None" && name === "") {
      const students = await studentModel.find({
        tuition_db_id: _id,
        confirm,
      });
      // console.log(students);

      res.status(200).send({
        success: true,
        message: "Filtered Applied Successfully",
        students,
      });
    } else if (confirm === "None" && standard !== "None" && name === "") {
      const students = await studentModel.find({
        tuition_db_id: _id,
        standard,
      });
      // console.log(students);
      res.status(200).send({
        success: true,
        message: "Filtered Applied Successfully",
        students,
      });
    } else if (confirm === "None" && standard === "None" && name !== "") {
      const students = await studentModel.find({
        tuition_db_id: _id,
        $or: [{ name: { $regex: name, $options: "i" } }],
      });
      // console.log(students);
      res.status(200).send({
        success: true,
        message: "Filtered Applied Successfully",
        students,
      });
    } else if (confirm !== "None" && standard !== "None" && name === "") {
      const students = await studentModel.find({
        tuition_db_id: _id,
        confirm,
        standard,
      });
      // console.log(students);
      res.status(200).send({
        success: true,
        message: "Filtered Applied Successfully",
        students,
      });
    } else if (confirm !== "None" && standard === "None" && name !== "") {
      const students = await studentModel.find({
        tuition_db_id: _id,
        confirm,
        $or: [{ name: { $regex: name, $options: "i" } }],
      });
      // console.log(students);
      res.status(200).send({
        success: true,
        message: "Filtered Applied Successfully",
        students,
      });
    } else if (confirm === "None" && standard !== "None" && name !== "") {
      const students = await studentModel.find({
        tuition_db_id: _id,
        standard,
        $or: [{ name: { $regex: name, $options: "i" } }],
      });
      // console.log(students);
      res.status(200).send({
        success: true,
        message: "Filtered Applied Successfully",
        students,
      });
    } else {
      const students = await studentModel.find({
        tuition_db_id: _id,
        confirm,
        standard,
        $or: [{ name: { $regex: name, $options: "i" } }],
      });
      console.log(students);
      res.status(200).send({
        success: true,
        message: "Filtered Applied Successfully",
        students,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Fetching Details",
      error,
    });
  }
};

//get || filtered students (fees based)
export const getFilteredStudentFeesBasedController = async (req, res) => {
   try {
     const { token } = req.params;
     const { feesStatus , name } = req.body;
     const _id = JWT.verify(token, process.env.JSONWEBTOKENKEY);
     // console.log(_id,req.body);
     if (feesStatus === "None"  && name === "") {
       res.status(200).send({
         success: false,
         message: "No Filter Applied",
       });
     } else if (feesStatus !== "None"  && name === "") {
       const students = await studentModel.find({
         tuition_db_id: _id,
         feesStatus,
       });
       // console.log(students);

       res.status(200).send({
         success: true,
         message: "Filtered Applied Successfully",
         students,
       });
     } else if (feesStatus === "None" && name !== "") {
       const students = await studentModel.find({
         tuition_db_id: _id,
         $or: [{ name: { $regex: name, $options: "i" } }],
       });
       // console.log(students);
       res.status(200).send({
         success: true,
         message: "Filtered Applied Successfully",
         students,
       });
     } else {
       const students = await studentModel.find({
         tuition_db_id: _id,
         feesStatus,
         $or: [{ name: { $regex: name, $options: "i" } }],
       });
       console.log(students);
       res.status(200).send({
         success: true,
         message: "Filtered Applied Successfully",
         students,
       });
     }
   } catch (error) {
     res.status(500).send({
       success: false,
       message: "Error in Fetching Details",
       error,
     });
   }
}

//submit answer controller

export const submitAnswerController = async (req, res) => {
  try {
    const { modalAnswer } = req.body;
    console.log(modalAnswer);
    const { id } = req.params;
    console.log(id);
    const submit = await qnaModel.findByIdAndUpdate(
      { _id: id },
      { answer: modalAnswer },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: " Answer Submitted",
      submit,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Account",
      error,
    });
  }
};

//delete question
export const deleteQuestionHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await qnaModel.findByIdAndDelete({ _id: id });
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
};

//update subscribe
export const updateSubscribeController = async (req, res) => {
  try {
    const { tuition_id } = req.body;
    const tuition = await tuitionModel.findByIdAndUpdate(
      { _id: tuition_id },
      { subscribed: true },
      { new: true }
    );
    res.send({
      success: true,
      tuition,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Account",
      error,
    });
  }
};

// get || subscri.. details
export const getSubscriptionDetailsController = async (req, res) => {
  try {
    const { token } = req.params;
    const tuition_id = JWT.verify(token, process.env.JSONWEBTOKENKEY);
    // console.log(_id);
    const tuition = await orderModel.findOne({ tuition_id });
    res.status(200).send({
      success: true,
      message: "Fetched Successfully",
      tuition
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Account",
      error,
    });
  }
};
