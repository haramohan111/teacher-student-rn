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
// src/pages/Student/EditStudent.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/Add.css';
import { apiRequest } from '../../services/apiv1'; // ✅ should support generics
const EditStudent = () => {
    const navigate = useNavigate();
    const { sid } = useParams();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        password: '',
        confirmPassword: '',
        courses: []
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim())
            newErrors.firstName = 'First name is required';
        if (!formData.email.trim())
            newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email))
            newErrors.email = 'Email is invalid';
        if (!formData.password)
            newErrors.password = 'Password is required';
        else if (formData.password.length < 8)
            newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (!validateForm())
            return;
        setIsSubmitting(true);
        setErrors({});
        try {
            const updatedStudent = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                studentId: formData.studentId,
                password: formData.password,
                courses: formData.courses
            };
            if (sid) {
                yield apiRequest({
                    endpoint: `student/${sid}`,
                    method: 'PUT',
                    data: updatedStudent
                });
            }
            navigate('/admin/student/manage');
        }
        catch (error) {
            console.error('Update failed:', error);
            setErrors(prev => (Object.assign(Object.assign({}, prev), { submit: 'Failed to update student. Please try again.' })));
        }
        finally {
            setIsSubmitting(false);
        }
    });
    useEffect(() => {
        const fetchStudent = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!sid)
                return;
            try {
                const response = yield apiRequest({
                    endpoint: `student/${sid}`,
                    method: 'GET'
                });
                setFormData({
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                    studentId: response.studentId,
                    password: '',
                    confirmPassword: '',
                    courses: response.courses || []
                });
            }
            catch (err) {
                console.error('Error fetching student:', err);
            }
        });
        fetchStudent();
    }, [sid]);
    return (_jsx("div", { className: "content", children: _jsxs("div", { className: "card", children: [_jsx("h2", { children: "Edit Student" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "firstName", children: "First Name" }), _jsx("input", { type: "text", id: "firstName", name: "firstName", value: formData.firstName, onChange: handleChange, className: errors.firstName ? 'error' : '', placeholder: "Enter first name" }), errors.firstName && _jsx("span", { className: "error-message", children: errors.firstName })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "lastName", children: "Last Name" }), _jsx("input", { type: "text", id: "lastName", name: "lastName", value: formData.lastName, onChange: handleChange, placeholder: "Enter last name" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, className: errors.email ? 'error' : '', placeholder: "Enter email" }), errors.email && _jsx("span", { className: "error-message", children: errors.email })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "studentId", children: "Student ID" }), _jsx("input", { type: "text", id: "studentId", name: "studentId", value: formData.studentId, onChange: handleChange, placeholder: "Enter student ID" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, className: errors.password ? 'error' : '', placeholder: "Enter password" }), errors.password && _jsx("span", { className: "error-message", children: errors.password })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "confirmPassword", children: "Confirm Password" }), _jsx("input", { type: "password", id: "confirmPassword", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, className: errors.confirmPassword ? 'error' : '', placeholder: "Confirm password" }), errors.confirmPassword && _jsx("span", { className: "error-message", children: errors.confirmPassword })] })] }), errors.submit && _jsx("div", { className: "error-message submit-error", children: errors.submit }), _jsxs("div", { className: "form-row", children: [_jsx("button", { type: "submit", disabled: isSubmitting, className: "submit-btn", children: isSubmitting ? 'Updating...' : 'Update Student' }), _jsx("button", { type: "button", onClick: () => navigate('/admin/student/manage'), className: "cancel-btn", children: "Cancel" })] })] })] }) }));
};
export default EditStudent;
