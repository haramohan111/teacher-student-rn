// src/pages/Teacher/EditTeacher.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Add.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  updateTeacherAsync,
  fetchTeacherByIdAsync,
  selectTeacherById,
  selectTeacherStatus,
  selectTeacherError,
  resetStatus,
} from "../../redux/features/teacher/teacherSlice";
import { toast } from "react-toastify";

interface FormDataType {
  name: string;
  email: string;
  subject: string;
  classbatch: string;
  phone: string;
  joinDate: string;
  profileImage: File | null;
  password: string;
  repassword: string;
}

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
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const teacher = useSelector((state: any) => selectTeacherById(state, id!));
  const status = useSelector(selectTeacherStatus);
  const error = useSelector(selectTeacherError);

  const [formData, setFormData] = useState<FormDataType>({
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Load teacher data
  useEffect(() => {
    if (id) {
      dispatch(fetchTeacherByIdAsync(id));
    }
  }, [id, dispatch]);

  // Prefill form once teacher data is available
  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        classbatch: teacher.classbatch,
        phone: teacher.phone ?? "",
        joinDate: teacher.joinDate ?? "",
        profileImage: null, // file only if changed
        password: "",
        repassword: "",
      });
      if (teacher?.profileImageUrl) setImagePreview(teacher?.profileImageUrl);
    }
  }, [teacher]);

  // Toast and reset after update
  useEffect(() => {
    if (!submitted) return;
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.classbatch.trim()) newErrors.classbatch = "Class is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (formData.password && formData.password !== formData.repassword) {
      newErrors.repassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
setSubmitted(true);
    try {
      await dispatch(
        updateTeacherAsync({
          id: id!,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          classbatch: formData.classbatch,
          phone: formData.phone,
          joinDate: formData.joinDate,
          profileFile: formData.profileImage ?? undefined,
          password: formData.password,
        })
      ).unwrap();
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to update teacher" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-teacher-container">
      <div className="card">
        <h2>Edit Teacher</h2>
        <form onSubmit={handleSubmit}>
          {/* reuse same form fields from AddTeacher */}
          {/* Name */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          {/* subject + class */}
          <div className="form-row">
            <div className="form-group">
              <label>Subject*</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Class*</label>
              <select
                name="classbatch"
                value={formData.classbatch}
                onChange={handleChange}
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* phone + join date */}
          <div className="form-row">
            <div className="form-group">
              <label>Phone*</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Joining Date</label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* password */}
          <div className="form-row">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="repassword"
                value={formData.repassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* image */}
<div className="form-row">
  <div className="form-group file-upload">
    <label>Profile Image</label>
    <input type="file" accept="image/*" onChange={handleFileChange} />
    {imagePreview && (
      <img 
        src={imagePreview} 
        alt="preview" 
        className="image-preview" 
      />
    )}
  </div>
</div>


          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Teacher"}
            </button>
            <button type="button" onClick={() => navigate("/admin/teacher/manage-teachers")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacher;
