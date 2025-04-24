import express from 'express';
import { createStudent, getStudentById, deleteStudent } from '../controllers/student.controller.js';

const router = express.Router();

router.get('/', (req, res) => {res.send("Student Route");});
router.post('/', createStudent);
router.get('/:id', getStudentById);
// router.get('/delete/:id', deleteStudent);

export default router;