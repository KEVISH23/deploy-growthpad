import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";
import feesModal from "../models/feesModal.js";
dotenv.config();
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, amount, tuition_id, student_id, name, duration } = req.body;
    //  console.log(name,duration);
    const date = new Date().getDate().toLocaleString();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear() + parseInt(duration);
    const expireDate = date + "/" + month.toString() + "/" + year.toString();

    let newTransaction = gateway.transaction.sale(
      {
        amount: amount,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            tuition_id,
            payment: result,
            student_id,
            name,
            duration,
            expireDate,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const brainTreeStudentFeesPaymentController = async (req, res) => {
   try {
     const { nonce,tuition_id, student_id,amount } = req.body;
     
     let newTransaction = gateway.transaction.sale(
       {
         amount: amount,
         paymentMethodNonce: nonce,
         options: {
           submitForSettlement: true,
         },
       },
       function (error, result) {
         if (result) {
           const fees = new feesModal({
             tuition_id,
             payment: result,
             student_id,
             fees:amount
           }).save();
           res.send({
             success: true,
             message: "Fees Paid Successfully",
           });
         } else {
           res.status(500).send(error);
         }
       }
     );
   } catch (error) {
     console.log(error);
   }
}