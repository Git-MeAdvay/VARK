import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    auth: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    students: [
        {
            type: String
        }
    ],
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;