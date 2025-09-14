var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Teacher/EditTeacher.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Add.css";
import { useDispatch, useSelector } from "react-redux";
import { updateTeacherAsync, fetchTeacherByIdAsync, selectTeacherById, selectTeacherStatus, selectTeacherError, resetStatus, } from "../../redux/features/teacher/teacherSlice";
import { toast } from "react-toastify";
const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Hindi",
    "Computer Science",
    "History",
    "Geography",
    "Economics",
    "Political Science",
    "Accountancy",
    "Business Studies",
];
const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const EditTeacher = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const teacher = useSelector((state) => selectTeacherById(state, id));
    const status = useSelector(selectTeacherStatus);
    const error = useSelector(selectTeacherError);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        classbatch: "",
        phone: "",
        joinDate: "",
        profileImage: null,
        password: "",
        repassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    // Load teacher data
    useEffect(() => {
        if (id) {
            dispatch(fetchTeacherByIdAsync(id));
        }
    }, [id, dispatch]);
    // Prefill form once teacher data is available
    useEffect(() => {
        var _a, _b;
        if (teacher) {
            setFormData({
                name: teacher.name,
                email: teacher.email,
                subject: teacher.subject,
                classbatch: teacher.classbatch,
                phone: (_a = teacher.phone) !== null && _a !== void 0 ? _a : "",
                joinDate: (_b = teacher.joinDate) !== null && _b !== void 0 ? _b : "",
                profileImage: null, // file only if changed
                password: "",
                repassword: "",
            });
            if (teacher === null || teacher === void 0 ? void 0 : teacher.profileImageUrl)
                setImagePreview(teacher === null || teacher === void 0 ? void 0 : teacher.profileImageUrl);
        }
    }, [teacher]);
    // Toast and reset after update
    useEffect(() => {
        if (!submitted)
            return;
        if (status === "succeeded") {
            toast.success("Teacher updated successfully");
            setIsSubmitting(false);
            dispatch(resetStatus());
            navigate("/admin/teacher/manage-teachers");
        }
        if (status === "failed" && error) {
            toast.error(error || "Failed to update teacher");
            setIsSubmitting(false);
            dispatch(resetStatus());
        }
    }, [status, error, dispatch, navigate]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleFileChange = (e) => {
        const { files } = e.target;
        if (files && files[0]) {
            setFormData((prev) => (Object.assign(Object.assign({}, prev), { profileImage: files[0] })));
            setImagePreview(URL.createObjectURL(files[0]));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim())
            newErrors.name = "Name is required";
        if (!formData.email.trim())
            newErrors.email = "Email is required";
        if (!formData.subject.trim())
            newErrors.subject = "Subject is required";
        if (!formData.classbatch.trim())
            newErrors.classbatch = "Class is required";
        if (!formData.phone.trim())
            newErrors.phone = "Phone is required";
        if (formData.password && formData.password !== formData.repassword) {
            newErrors.repassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        e.preventDefault();
        if (!validateForm())
            return;
        setIsSubmitting(true);
        setSubmitted(true);
        try {
            yield dispatch(updateTeacherAsync({
                id: id,
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                classbatch: formData.classbatch,
                phone: formData.phone,
                joinDate: formData.joinDate,
                profileFile: (_a = formData.profileImage) !== null && _a !== void 0 ? _a : undefined,
                password: formData.password,
            })).unwrap();
        }
        catch (error) {
            setErrors({ submit: error.message || "Failed to update teacher" });
            setIsSubmitting(false);
        }
    });
    return (_jsx("div", { className: "add-teacher-container", children: _jsxs("div", { className: "card", children: [_jsx("h2", { children: "Edit Teacher" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", children: "Name*" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange }), errors.name && _jsx("span", { className: "error-message", children: errors.name })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email*" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange }), errors.email && _jsx("span", { className: "error-message", children: errors.email })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Subject*" }), _jsxs("select", { name: "subject", value: formData.subject, onChange: handleChange, children: [_jsx("option", { value: "", children: "Select subject" }), subjects.map((s) => (_jsx("option", { value: s, children: s }, s)))] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Class*" }), _jsxs("select", { name: "classbatch", value: formData.classbatch, onChange: handleChange, children: [_jsx("option", { value: "", children: "Select class" }), classes.map((c) => (_jsx("option", { value: c, children: c }, c)))] })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Phone*" }), _jsx("input", { type: "text", name: "phone", value: formData.phone, onChange: handleChange })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Joining Date" }), _jsx("input", { type: "date", name: "joinDate", value: formData.joinDate, onChange: handleChange })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "New Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Confirm Password" }), _jsx("input", { type: "password", name: "repassword", value: formData.repassword, onChange: handleChange })] })] }), _jsx("div", { className: "form-row", children: _jsxs("div", { className: "form-group file-upload", children: [_jsx("label", { children: "Profile Image" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleFileChange }), imagePreview && (_jsx("img", { src: imagePreview, alt: "preview", className: "image-preview" }))] }) }), _jsxs("div", { className: "form-actions", children: [_jsx("button", { type: "submit", disabled: isSubmitting, children: isSubmitting ? "Updating..." : "Update Teacher" }), _jsx("button", { type: "button", onClick: () => navigate("/admin/teacher/manage-teachers"), children: "Cancel" })] })] })] }) }));
};
export default EditTeacher;
