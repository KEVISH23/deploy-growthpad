import express from 'express'
import dotenv from 'dotenv'
import connectionDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import tuitionRoutes from './routes/tuitionRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
//confid dotenv
dotenv.config()
const port = process.env.PORT || 1911
//connect DB
connectionDB();

//middleware
app.use(express.json())
app.use(cors());
app.use(cookieParser())
//using Routes
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/tuition", tuitionRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/admin",adminRoutes)

//Listening to a Port number 
app.listen(port,()=>{
    console.log(`Listening..... ${port}`)
})

