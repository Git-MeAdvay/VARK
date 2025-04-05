import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    auth: {
        type: String,
        required: true,
    },
    Id: {
        type: String,
        required: true,
    },
    testData: {
        type: Object,
        required: true,
    },
    testResult: {
        type: Object,
        required: true,
    },
}, {
    timestamps: true,
});

const Student = mongoose.model("Student", studentSchema);

export default Student;