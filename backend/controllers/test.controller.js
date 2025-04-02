import Test from '../models/test.model.js';

export const createTest = async (req, res) => {
  try {
    const { name, auth, Id , testData } = req.body;
    if (!testData || testData.length !== 8) {
      return res.status(400).json({success:false, message: "Invalid Request." });
    }
    const test = new Test({ name, auth, Id , testData });
    await test.save();
    res.status(201).json({success:true, message: "Test created successfully", data: test });
  } catch (error) {
    res.status(500).json({ success:false, message: error.message });
  }
};

export const getAllTest = async (req, res) => {
  try {
    const tests = await Test.find();
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTest = async (req, res) => {
  try {
    const { name, auth, Id , testData } = req.body;
    if (testData && testData.length !== 8) {
      return res.status(400).json({ message: "Invalid Request" });
    }
    const test = await Test.findByIdAndUpdate(req.params.id, { name, auth, Id , testData }, { new: true });
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
