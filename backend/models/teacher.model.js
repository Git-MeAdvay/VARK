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
    ilsData: {
        type: Object,
        required: true,
    },
    ilsResults: {
        type: Object,
        required: true,
    },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;