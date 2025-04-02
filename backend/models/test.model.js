import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  auth: { type: String, required: true },
  Id: { type: String, required: true },
  testData: { type: Object, required: true,},
}, {
  timestamps: true,
});

const Test = mongoose.model("Test", testSchema);

export default Test;