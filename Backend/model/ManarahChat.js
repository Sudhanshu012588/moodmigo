import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  messages: {
    type: [messageSchema], // Array of message-reply pairs
    default: [],
  },
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
