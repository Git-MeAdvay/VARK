import Teacher from "../models/teacher.model";

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
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTeacher = async (req, res) => {
    try {
        const { name, auth, email, password } = req.body;
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, { name, auth, email, password }, { new: true });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ message: "Teacher updated successfully", data: teacher });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {createTeacher, getTeacherById, updateTeacher};