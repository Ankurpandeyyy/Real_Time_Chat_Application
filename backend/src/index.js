import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import {app , server} from "./lib/socket.js";

import path from "path";  // for deployment

dotenv.config()
//const app = express();  // it is already defined in socket.js file

const port = process.env.PORT ;
const __dirname = path.resolve();  // at the time of deployment
app.use(cookieParser());
app.use(express.json());
 //parsing cookies or grabing value from cookies

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://real-time-chat-application-gun1.onrender.com", // or your frontend domain if it's separate
// ];
app.use(cors({
    origin:["http://localhost:5173"],
    credentials: true,
}))

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

// This is needed for cookies to work behind proxies (like Render)
//app.set("trust proxy", 1);

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
    })
}


server.listen(port, () => {
    console.log(`server running on port : ${port}`);
    connectDB();
})