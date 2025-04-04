import Login from "../models/login.model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
    try {
        const { name, email, passWord } = req.body;
        if (!name || !email || !passWord) {
        return res.status(400).json({ success: false, message: "Invalid Request." });
        }
        const existingUser = await Login.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists." });
        }
        const hashedPassword = await bcrypt.hash(passWord, 10);
        const user = new Login({ name, email, passWord: hashedPassword });
        await user.save();
        res.status(201).json({ success: true, message: "User registered successfully",user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const signin = async (req, res) => {
    try {
        const { email, passWord } = req.body;
        if (!email || !passWord) {
            return res.status(400).json({ success: false, message: "Invalid Request." });
        }
        const user = await Login.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }
        const isMatch = await bcrypt.compare(passWord, user.passWord);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials." });
        }
        res.status(200).json({ success: true, message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}