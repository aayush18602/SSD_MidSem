import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  content: String,
  status: String,
  answer: String,
  isPinned: Boolean,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { collection: "Questions", timestamps: true });

const Question = mongoose.model("Question", questionSchema);

export default Question;
