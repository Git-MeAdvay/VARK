import Teacher from "../models/teacher.model.js";

const createTeacher = async (req, res) => {
    try {
        const { name, auth, email, password } = req.body;
        const existingTeacher = await Teacher.findOne({ email: email, password: password });
        if (existingTeacher) {
            return res.status(409).json({ success: false, message: "Teacher already exists" });
        }
        const teacher = new Teacher({ name, auth, email, password, students: [] });
        await teacher.save();
        return res.status(201).json({ success: true, message: "Teacher created successfully", data: teacher });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({auth: req.params.auth});
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ success: true, message: "Valid Auth Code.", data: teacher });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTeacher = async (req, res) => {
    try {
        const { ilsData, ilsResults, _id } = req.body;
        const teacher = await Teacher.findByIdAndUpdate(_id, { $set: { ilsData: ilsData, ilsResults: ilsResults } });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }
        res.status(200).json({ success:true, message: "Teacher updated successfully", data: teacher });
    } catch (error) {
        res.status(500).json({ success:false, message: error.message });
    }
}

const verify = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ auth: req.params.auth });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }
        res.status(200).json({ success: true, message: "Teacher verified successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export {createTeacher, getTeacherById, updateTeacher, verify};