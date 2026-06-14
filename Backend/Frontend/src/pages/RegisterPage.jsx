import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import api from '../api/api';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(data.data);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏠</div>
          <h1 className="auth-title">Join PropSpace</h1>
          <p className="auth-subtitle">Create your account and start listing properties</p>
        </div>

        {serverError && (
          <div className="server-error-banner">
            <span>⚠️</span> {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <InputField id="username" label="Username" value={form.username} onChange={handleChange}
            placeholder="Choose a username" error={errors.username} required />
          <InputField id="email" label="Email Address" type="email" value={form.email} onChange={handleChange}
            placeholder="you@example.com" error={errors.email} required />
          <InputField id="password" label="Password" type="password" value={form.password} onChange={handleChange}
            placeholder="Min. 6 characters" error={errors.password} required />
          <InputField id="confirmPassword" label="Confirm Password" type="password" value={form.confirmPassword}
            onChange={handleChange} placeholder="Repeat your password" error={errors.confirmPassword} required />

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="register-submit-btn">
            {loading ? <span className="btn-loading"><span className="btn-spinner"/></span> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
