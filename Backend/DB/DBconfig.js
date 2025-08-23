import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb+srv://moodmigo59:Sudhanshu@cluster0.kucnotx.mongodb.net/"
    );
    console.log("✅ DB connected successfully:", connectionInstance.connection.host);
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    process.exit(1);
  }
};
