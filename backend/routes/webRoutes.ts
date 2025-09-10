import express from "express";
import multer from "multer";
import { addTeacher, deleteTeacher, getAllTeachers, getTeacherById, updateTeacher } from "../controller/teacherController";
import { get } from "http";

const router = express.Router();
// const upload = multer({ dest: "uploads" });
// import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });


router.post("/teachers",upload.single("profileFile"), addTeacher);
router.get("/teachers", getAllTeachers);
router.put("/teachers/:id",upload.single("profileFile"),updateTeacher);
router.get("/teachers/:id",getTeacherById);
router.delete("/teachers/:id",deleteTeacher);

export default router;
