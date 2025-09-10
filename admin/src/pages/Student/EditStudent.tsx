// src/pages/Student/EditStudent.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/Add.css';
import { apiRequest } from '../../services/apiv1'; // ✅ should support generics

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  password: string;
  confirmPassword: string;
  courses: string[];
}

interface Errors {
  firstName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

interface StudentResponse {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  courses?: string[];
}

const EditStudent: React.FC = () => {
  const navigate = useNavigate();
  const { sid } = useParams<{ sid: string }>();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
    courses: []
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        await apiRequest<typeof updatedStudent, StudentResponse>({
          endpoint: `student/${sid}`,
          method: 'PUT',
          data: updatedStudent
        });
      }

      navigate('/admin/student/manage');
    } catch (error: any) {
      console.error('Update failed:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to update student. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchStudent = async () => {
      if (!sid) return;
      try {
        const response = await apiRequest<null, StudentResponse>({
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
      } catch (err) {
        console.error('Error fetching student:', err);
      }
    };

    fetchStudent();
  }, [sid]);

  return (
    <div className="content">
      <div className="card">
        <h2>Edit Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter student ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

          <div className="form-row">
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? 'Updating...' : 'Update Student'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/student/manage')}
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

export default EditStudent;
