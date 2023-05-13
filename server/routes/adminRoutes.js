import express from "express";
import { adminLoginController, allStudentsDetailsController, allTuitionDetailsController } from "../controllers/adminController.js";

const router = express.Router();

//addmin lloogin
router.post("/login", adminLoginController)

//get all tuition details
router.get("/all-tuitions",allTuitionDetailsController)

//get all student details
router.get("/all-students",allStudentsDetailsController)

export default router;