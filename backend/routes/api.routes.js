import express from 'express';
import { createTest , deleteTest, getAllTest, updateTest, getTestById } from '../controllers/test.controller.js';

const router = express.Router();


router.get('/', getAllTest);
router.post('/', createTest);        
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);
router.get('/:id', getTestById);

export default router;