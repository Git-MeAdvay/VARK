import express from 'express';
import { createStudent, getStudentById } from '../controllers/student.controller.js';

const router = express.Router();

router.get('/', (req, res) => {res.send("Student Route");});
router.post('/', createStudent);
router.get('/:id', getStudentById);

export default router;