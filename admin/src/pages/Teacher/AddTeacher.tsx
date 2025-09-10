import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Add.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  addTeacherAsync,
  selectTeacherStatus,
  selectTeacherError,
  resetStatus,
} from "../../redux/features/teacher/teacherSlice";
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

// ---------------- Form Data Interface ----------------
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

const AddTeacher = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  // ---------------- Form Validation ----------------
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.classbatch.trim()) newErrors.classbatch = "Class is required";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.repassword.trim()) newErrors.repassword = "Confirm password is required";
    if (formData.password && formData.repassword && formData.password !== formData.repassword)
      newErrors.repassword = "Passwords do not match";

    if (formData.profileImage && !formData.profileImage.type.includes("image/")) {
      newErrors.profileImage = "Please upload a valid image file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await dispatch(
        addTeacherAsync({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          classbatch: formData.classbatch,
          phone: formData.phone,
          joinDate: formData.joinDate,
          profileFile: formData.profileImage ?? undefined,
          password: formData.password, // include password
        })
      ).unwrap();
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to add teacher" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-teacher-container">
      <div className="card">
        <h2>Add New Teacher</h2>
        <form onSubmit={handleSubmit}>
          {/* Row 1: Name + Email */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter teacher name"
                className={errors.name ? "error" : ""}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter teacher email"
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          </div>

          {/* Row 2: Subject + Class */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject">Subject*</label>
              <div style={{ display: "flex", gap: "10px" }}>
                {/* Dropdown */}
                <select
                  id="subject"
                  name="subject"
                  value={
                    subjects.includes(formData.subject)
                      ? formData.subject
                      : "custom"
                  }
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setFormData((prev) => ({ ...prev, subject: "" }));
                    } else {
                      handleChange(e);
                    }
                  }}
                  className={errors.subject ? "error" : ""}
                >
                  <option value="">Select subject</option>
                  {subjects.map((subj, i) => (
                    <option key={i} value={subj}>
                      {subj}
                    </option>
                  ))}
                  <option value="custom">Other...</option>
                </select>

                {/* Input box for custom subject */}
                {(!subjects.includes(formData.subject) ||
                  formData.subject === "") && (
                  <input
                    type="text"
                    placeholder="Enter custom subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    className={errors.subject ? "error" : ""}
                  />
                )}
              </div>
              {errors.subject && (
                <span className="error-message">{errors.subject}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="classbatch">Class*</label>
              <select
                id="classbatch"
                name="classbatch"
                value={formData.classbatch}
                onChange={handleChange}
                className={errors.classbatch ? "error" : ""}
              >
                <option value="">Select class</option>
                {classes.map((cls, i) => (
                  <option key={i} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              {errors.classbatch && (
                <span className="error-message">{errors.classbatch}</span>
              )}
            </div>
          </div>

          {/* Row 3: Phone */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone*</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>
          </div>

          {/* Row 4: Join Date */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="joinDate">Joining Date</label>
              <input
                type="date"
                id="joinDate"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 5: Password + Repassword */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="repassword">Confirm Password*</label>
              <input
                type="password"
                id="repassword"
                name="repassword"
                value={formData.repassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={errors.repassword ? "error" : ""}
              />
              {errors.repassword && (
                <span className="error-message">{errors.repassword}</span>
              )}
            </div>
          </div>

          {/* Row 6: Profile Image */}
          <div className="form-row">
            <div className="form-group file-upload">
              <label htmlFor="profileImage">Profile Image</label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className={errors.profileImage ? "error" : ""}
              />
              {errors.profileImage && (
                <span className="error-message">{errors.profileImage}</span>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="image-preview"
                />
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? "Saving..." : "Add Teacher"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/manage-teachers")}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;
