import express from "express";

import { brainTreePaymentController, brainTreeStudentFeesPaymentController, brainTreeTokenController } from "../controllers/paymentController.js";

const router = express.Router();

//tuition subscription
router.get("/braintree/token", brainTreeTokenController)
router.post("/braintree/payment", brainTreePaymentController)

//student fees
router.get("/braintree/token", brainTreeTokenController)
router.post("/braintree/student/payment", brainTreeStudentFeesPaymentController)
export default router;
