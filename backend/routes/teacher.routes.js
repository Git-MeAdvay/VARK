import expresss from "express";
import { updateTeacher, verify, getTeacherById } from "../controllers/teacher.controller.js";

const router = expresss.Router();

router.get('/', (req, res) => {res.send("Teacher Route")});
router.post('/', updateTeacher);
router.get('/verify/:auth', verify);
router.get('/:auth', getTeacherById);

export default router;
