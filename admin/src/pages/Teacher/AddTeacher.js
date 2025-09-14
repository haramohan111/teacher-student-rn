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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Add.css";
import { useDispatch, useSelector } from "react-redux";
import { addTeacherAsync, selectTeacherStatus, selectTeacherError, resetStatus, } from "../../redux/features/teacher/teacherSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ---------------- Dropdown Data ----------------
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
const AddTeacher = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
    // 👉 React to status changes
    useEffect(() => {
        if (status === "succeeded" && isSubmitting == true) {
            toast.success("Teacher added successfully");
            // reset form after success
            setFormData({
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
            setImagePreview(null);
            setErrors({});
            setIsSubmitting(false);
            dispatch(resetStatus());
            // navigate("/admin/manage-teachers"); // optional redirect
        }
        if (status === "failed" && error) {
            toast.error(error || "Failed to add teacher");
            setIsSubmitting(false);
            dispatch(resetStatus());
        }
    }, [status, error, dispatch]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: files[0] })));
            setImagePreview(URL.createObjectURL(files[0]));
        }
    };
    // ---------------- Form Validation ----------------
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim())
            newErrors.name = "Name is required";
        if (!formData.email.trim())
            newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Invalid email";
        if (!formData.subject.trim())
            newErrors.subject = "Subject is required";
        if (!formData.classbatch.trim())
            newErrors.classbatch = "Class is required";
        if (!formData.phone.trim())
            newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone))
            newErrors.phone = "Invalid phone number";
        if (!formData.password.trim())
            newErrors.password = "Password is required";
        if (!formData.repassword.trim())
            newErrors.repassword = "Confirm password is required";
        if (formData.password && formData.repassword && formData.password !== formData.repassword)
            newErrors.repassword = "Passwords do not match";
        if (formData.profileImage && !formData.profileImage.type.includes("image/")) {
            newErrors.profileImage = "Please upload a valid image file";
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
        try {
            yield dispatch(addTeacherAsync({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                classbatch: formData.classbatch,
                phone: formData.phone,
                joinDate: formData.joinDate,
                profileFile: (_a = formData.profileImage) !== null && _a !== void 0 ? _a : undefined,
                password: formData.password, // include password
            })).unwrap();
        }
        catch (error) {
            setErrors({ submit: error.message || "Failed to add teacher" });
            setIsSubmitting(false);
        }
    });
    return (_jsx("div", { className: "add-teacher-container", children: _jsxs("div", { className: "card", children: [_jsx("h2", { children: "Add New Teacher" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", children: "Name*" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, placeholder: "Enter teacher name", className: errors.name ? "error" : "" }), errors.name && (_jsx("span", { className: "error-message", children: errors.name }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email*" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "Enter teacher email", className: errors.email ? "error" : "" }), errors.email && (_jsx("span", { className: "error-message", children: errors.email }))] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "subject", children: "Subject*" }), _jsxs("div", { style: { display: "flex", gap: "10px" }, children: [_jsxs("select", { id: "subject", name: "subject", value: subjects.includes(formData.subject)
                                                        ? formData.subject
                                                        : "custom", onChange: (e) => {
                                                        if (e.target.value === "custom") {
                                                            setFormData((prev) => (Object.assign(Object.assign({}, prev), { subject: "" })));
                                                        }
                                                        else {
                                                            handleChange(e);
                                                        }
                                                    }, className: errors.subject ? "error" : "", children: [_jsx("option", { value: "", children: "Select subject" }), subjects.map((subj, i) => (_jsx("option", { value: subj, children: subj }, i))), _jsx("option", { value: "custom", children: "Other..." })] }), (!subjects.includes(formData.subject) ||
                                                    formData.subject === "") && (_jsx("input", { type: "text", placeholder: "Enter custom subject", value: formData.subject, onChange: (e) => setFormData((prev) => (Object.assign(Object.assign({}, prev), { subject: e.target.value }))), className: errors.subject ? "error" : "" }))] }), errors.subject && (_jsx("span", { className: "error-message", children: errors.subject }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "classbatch", children: "Class*" }), _jsxs("select", { id: "classbatch", name: "classbatch", value: formData.classbatch, onChange: handleChange, className: errors.classbatch ? "error" : "", children: [_jsx("option", { value: "", children: "Select class" }), classes.map((cls, i) => (_jsx("option", { value: cls, children: cls }, i)))] }), errors.classbatch && (_jsx("span", { className: "error-message", children: errors.classbatch }))] })] }), _jsx("div", { className: "form-row", children: _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "phone", children: "Phone*" }), _jsx("input", { type: "text", id: "phone", name: "phone", value: formData.phone, onChange: handleChange, placeholder: "Enter phone number", className: errors.phone ? "error" : "" }), errors.phone && (_jsx("span", { className: "error-message", children: errors.phone }))] }) }), _jsx("div", { className: "form-row", children: _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "joinDate", children: "Joining Date" }), _jsx("input", { type: "date", id: "joinDate", name: "joinDate", value: formData.joinDate, onChange: handleChange })] }) }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password*" }), _jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "Enter password", className: errors.password ? "error" : "" }), errors.password && (_jsx("span", { className: "error-message", children: errors.password }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "repassword", children: "Confirm Password*" }), _jsx("input", { type: "password", id: "repassword", name: "repassword", value: formData.repassword, onChange: handleChange, placeholder: "Re-enter password", className: errors.repassword ? "error" : "" }), errors.repassword && (_jsx("span", { className: "error-message", children: errors.repassword }))] })] }), _jsx("div", { className: "form-row", children: _jsxs("div", { className: "form-group file-upload", children: [_jsx("label", { htmlFor: "profileImage", children: "Profile Image" }), _jsx("input", { type: "file", id: "profileImage", name: "profileImage", accept: "image/*", onChange: handleFileChange, className: errors.profileImage ? "error" : "" }), errors.profileImage && (_jsx("span", { className: "error-message", children: errors.profileImage })), imagePreview && (_jsx("img", { src: imagePreview, alt: "Profile preview", className: "image-preview" }))] }) }), errors.submit && (_jsx("div", { className: "error-message submit-error", children: errors.submit })), _jsxs("div", { className: "form-actions", children: [_jsx("button", { type: "submit", disabled: isSubmitting, className: "submit-btn", children: isSubmitting ? "Saving..." : "Add Teacher" }), _jsx("button", { type: "button", onClick: () => navigate("/admin/manage-teachers"), className: "cancel-btn", children: "Cancel" })] })] })] }) }));
};
export default AddTeacher;
