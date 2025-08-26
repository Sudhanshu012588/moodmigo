import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import {connectDB} from "./DB/DBconfig.js"
import Chat from "./model/ManarahChat.js"
import { Resend } from 'resend';

const app = express();

app.use(cors());
app.use(express.json()); 
connectDB();

//storing chat
app.post("/manarah/savechat", async (req, res) => {
  try {
    const { userID, message, reply } = req.body;

    if (!userID || !message || !reply) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let userChat = await Chat.findOne({ userID });

    if (!userChat) {
      userChat = new Chat({
        userID,
        messages: [{ message, reply }],
      });
    } else {
      userChat.messages.push({ message, reply });
    }

    await userChat.save();

    res.status(200).json({ success: true, chat: userChat });
  } catch (error) {
    console.error("Error saving chat:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post('/manarah/get',async(req,res)=>{
  const {userid}=req.body;

  if(!userid){
    return res.status(500).json({
      status:"userid required",
      message:"Please provide the user id"
    })
  }
  try {
    const message = await Chat.findOne({userID:userid});
    if(message){
    return res.status(200).json({
      status:"ok",
      message
    })
  }
  else{
    throw new Error("Can't find the messages");
  }
  } catch (error) {
    return res.status(400).json({
      status:"failed",
    })
  }
  
})

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const resend = new Resend("re_hvorSSv3_DbeQK4FL4rbL4sEmfx34hXau"); // your API key

    const { data, error } = await resend.emails.send({
      from: "support@moodmigo.com", // needs to be a verified domain in Resend
      to, // single email or array of emails
      subject,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ success: false, error });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.listen("5000",(req,res)=>{
    console.log("Server running on port 5000");
})