// src/pages/User/EditUser.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/AddUser.css';
import { apiRequest } from '../../services/apiv1'; // make sure api.ts is typed

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'editor' | 'admin';
  password: string;
  confirmPassword: string;
  permissions: string[];
}

interface Errors {
  firstName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

interface UserResponse {
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'editor' | 'admin';
  permissions?: string[];
}

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { uid } = useParams<{ uid: string }>();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: '',
    permissions: []
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const availablePermissions = [
    { id: 'create', label: 'Create Content' },
    { id: 'edit', label: 'Edit Content' },
    { id: 'delete', label: 'Delete Content' },
    { id: 'publish', label: 'Publish Content' },
    { id: 'manage_users', label: 'Manage Users' }
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => {
      if (prev.permissions.includes(permissionId)) {
        return { ...prev, permissions: prev.permissions.filter(id => id !== permissionId) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permissionId] };
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const updatedUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        permissions: formData.permissions
      };

      if (uid) {
        await apiRequest<typeof updatedUser, UserResponse>({
          endpoint: `user/${uid}`,
          method: 'PUT',
          data: updatedUser
        });
      }

      navigate('/admin/user/manage-users');
    } catch (error: any) {
      console.error('Update failed:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to update user. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;
      try {
        const response = await apiRequest<null, UserResponse>({
          endpoint: `user/${uid}`,
          method: 'GET'
        });

        setFormData({
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          role: response.role,
          password: '',
          confirmPassword: '',
          permissions: response.permissions || []
        });
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [uid]);

  return (
    <div className="content">
      <div className="card">
        <h2>Edit Member</h2>
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
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
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
              {isSubmitting ? 'Updating...' : 'Update User'}
            </button>
            <button type="button" onClick={() => navigate('/admin/user/manage-users')} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
