import express from "express";
import multer from "multer";
import { addTeacher, deleteTeacher, getAllTeachers, getTeacherById, updateTeacher } from "../controller/teacherController";
import { get } from "http";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = express.Router();
// const upload = multer({ dest: "uploads" });
// import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });


router.post("/teachers",upload.single("profileFile"),verifyFirebaseToken, addTeacher);
router.get("/teachers",verifyFirebaseToken, getAllTeachers);
router.put("/teachers/:id",upload.single("profileFile"),verifyFirebaseToken,updateTeacher);
router.get("/teachers/:id",verifyFirebaseToken,getTeacherById);
router.delete("/teachers/:id",verifyFirebaseToken,deleteTeacher);

export default router;
