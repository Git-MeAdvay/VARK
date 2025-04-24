import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";

const testLength = process.env.TEST_LENGTH || 8;


export const createStudent = async (req, res) => {
    try {
        const { name, auth, Id, testData, testResult } = req.body;
        const existingStudent = await Student.findOneAndUpdate({ name:name, auth: auth, Id: Id }, { $set: { testData: testData, testResult: testResult } });
        if (existingStudent) {
            const teacher = await Teacher.findOne({ auth: auth });
            if (!teacher) {
                return res.status(404).json({ success: false, message: "Invalid Authentication Code." });
            }
            return res.status(201).json({ success: true, message: "Test Results Updated", data: existingStudent, _id: existingStudent._id });
        }
        if (!testData || !testResult) {
            return res.status(400).json({ success: false, message: "Test data or result is missing." });
        }
        const student = new Student({ name, auth, Id, testData, testResult });
        const teacher = await Teacher.findOneAndUpdate({ auth: auth }, { $push: { students: student._id } });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Invalid Authentication Code." });
        }
        await student.save();
        return res.status(201).json({ success: true, message: "Result saved successfully", data: student, _id: student._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({ Id: req.params.id });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const teacher = await Teacher.findOneAndUpdate({ auth: student.auth }, { $pull: { students: student._id } });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Invalid Authentication Code." });
        }
        res.status(200).json({ message: "Student named "+student.name+" deleted successfully from class with code "+student.auth });


    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

