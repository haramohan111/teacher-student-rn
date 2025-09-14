"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacher = exports.updateTeacher = exports.addTeacher = exports.getTeacherById = exports.getAllTeachers = void 0;
const firebase_1 = require("../firebase"); // <-- make sure your firebase file exports these (see note)
const cloudinaryUpload_1 = require("../utils/cloudinaryUpload");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const teachersCollection = firebase_1.db.collection("teachers");
const getAllTeachers = async (req, res) => {
    try {
        const user = req.user;
        console.log("Authenticated user:", user.uid, user.email);
        const snapshot = await teachersCollection.get();
        const teachers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(teachers);
    }
    catch (err) {
        res.status(500).json({ error: err.message ?? String(err) });
    }
};
exports.getAllTeachers = getAllTeachers;
const getTeacherById = async (req, res) => {
    try {
        const teacherDoc = await teachersCollection.doc(req.params.id).get();
        if (!teacherDoc.exists) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        res.json({ id: teacherDoc.id, ...teacherDoc.data() });
    }
    catch (err) {
        res.status(500).json({ error: err.message ?? String(err) });
    }
};
exports.getTeacherById = getTeacherById;
const addTeacher = async (req, res) => {
    try {
        const { name, email, subject, classbatch, phone, joinDate, password } = req.body;
        const profileFile = req.file;
        console.log("Received file:", profileFile);
        if (!name || !email || !password) {
            res.status(400).json({ error: "name, email and password are required" });
            return;
        }
        // Check email
        const emailQuery = await teachersCollection.where("email", "==", email).get();
        if (!emailQuery.empty) {
            res.status(400).json({ error: "Email already exists" });
            return;
        }
        // Check phone
        if (phone) {
            const phoneQuery = await teachersCollection.where("phone", "==", phone).get();
            if (!phoneQuery.empty) {
                res.status(400).json({ error: "Phone already exists" });
                return;
            }
        }
        // Create auth user
        const userRecord = await firebase_1.auth.createUser({
            email,
            password,
            displayName: name,
        });
        // Upload image if provided
        let profileImageUrl = "";
        let profilePublicId = "";
        if (profileFile) {
            console.log("Cloudinary ENV:", process.env.CLOUD_NAME, process.env.CLOUD_API_KEY);
            const result = await (0, cloudinaryUpload_1.uploadImageToCloudinary)(profileFile.buffer);
            profileImageUrl = result.secure_url;
            profilePublicId = result.public_id;
        }
        const newTeacher = {
            uid: userRecord.uid,
            name,
            email,
            subject: subject ?? "",
            classbatch: classbatch ?? "",
            phone: phone ?? "",
            joinDate: joinDate ?? new Date().toISOString(),
            profileImageUrl,
            profilePublicId,
        };
        const docRef = await teachersCollection.add(newTeacher);
        res.status(201).json({ id: docRef.id, ...newTeacher });
    }
    catch (err) {
        res.status(500).json({ error: err.message ?? String(err) });
    }
};
exports.addTeacher = addTeacher;
const updateTeacher = async (req, res) => {
    try {
        const { name, email, subject, classbatch, phone, joinDate, profileImageUrl: bodyImageUrl, profilePublicId: bodyPublicId } = req.body;
        const profileFile = req.file;
        const teacherRef = teachersCollection.doc(req.params.id);
        const existingSnap = await teacherRef.get();
        if (!existingSnap.exists) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        let profileImageUrl = bodyImageUrl || "";
        let profilePublicId = bodyPublicId || "";
        if (profileFile) {
            const result = await (0, cloudinaryUpload_1.uploadImageToCloudinary)(profileFile.buffer);
            profileImageUrl = result.secure_url;
            profilePublicId = result.public_id;
        }
        const updatedData = {
            name: name ?? existingSnap.data()?.name ?? "",
            email: email ?? existingSnap.data()?.email ?? "",
            subject: subject ?? existingSnap.data()?.subject ?? "",
            classbatch: classbatch ?? existingSnap.data()?.classbatch ?? "",
            phone: phone ?? existingSnap.data()?.phone ?? "",
            joinDate: joinDate ?? existingSnap.data()?.joinDate ?? new Date().toISOString(),
            profileImageUrl,
            profilePublicId,
        };
        await teacherRef.update(updatedData);
        res.json({ id: req.params.id, ...updatedData });
    }
    catch (err) {
        res.status(500).json({ error: err.message ?? String(err) });
    }
};
exports.updateTeacher = updateTeacher;
const deleteTeacher = async (req, res) => {
    try {
        const teacherDoc = await teachersCollection.doc(req.params.id).get();
        if (!teacherDoc.exists) {
            res.status(404).json({ error: "Teacher not found" });
            return;
        }
        const teacherData = teacherDoc.data();
        // 1. Delete from Firestore
        await teachersCollection.doc(req.params.id).delete();
        // 2. Delete from Firebase Authentication
        if (teacherData?.uid) {
            await firebase_1.auth.deleteUser(teacherData.uid);
        }
        // 3. Delete profile image from Cloudinary (optional)
        if (teacherData?.profilePublicId) {
            await cloudinary_1.default.uploader.destroy(teacherData.profilePublicId);
        }
        res.json({ message: "Teacher deleted successfully", id: req.params.id });
    }
    catch (err) {
        res.status(500).json({ error: err.message ?? String(err) });
    }
};
exports.deleteTeacher = deleteTeacher;
