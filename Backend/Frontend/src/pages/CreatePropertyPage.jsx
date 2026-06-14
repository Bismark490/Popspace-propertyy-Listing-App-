import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import api from '../api/api';

const PROPERTY_TYPES = ['Apartment', 'House', 'Studio'];

const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', price: '', city: '', country: '',
    type: '', listingType: 'rent', imageUrls: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim() || form.title.length < 5) errs.title = 'Title must be at least 5 characters';
    if (!form.description.trim() || form.description.length < 10) errs.description = 'Description must be at least 10 characters';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) errs.price = 'Enter a valid price';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.country.trim()) errs.country = 'Country is required';
    if (!form.type) errs.type = 'Select a property type';
    if (!form.listingType) errs.listingType = 'Select a listing type';
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
      const imageUrls = form.imageUrls
        ? form.imageUrls.split(',').map((u) => u.trim()).filter(Boolean)
        : [];
      await api.post('/properties', { ...form, price: Number(form.price), imageUrls });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">📋 Create New Listing</h1>
          <p className="form-subtitle">Fill in the details of your property</p>
        </div>

        {serverError && <div className="server-error-banner"><span>⚠️</span> {serverError}</div>}

        <form className="property-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <InputField id="title" label="Property Title" value={form.title} onChange={handleChange}
              placeholder="e.g. Cozy 2-Bedroom Apartment" error={errors.title} required />
            <InputField id="price" label="Price (USD)" type="number" value={form.price} onChange={handleChange}
              placeholder="e.g. 1200" error={errors.price} required min="0" />
          </div>

          <InputField id="description" label="Description" error={errors.description} required>
            <textarea id="description" className={`input-field textarea ${errors.description ? 'input-error' : ''}`}
              value={form.description} onChange={handleChange} placeholder="Describe the property..." rows={4} />
          </InputField>

          <div className="form-row">
            <InputField id="city" label="City" value={form.city} onChange={handleChange}
              placeholder="e.g. London" error={errors.city} required />
            <InputField id="country" label="Country" value={form.country} onChange={handleChange}
              placeholder="e.g. United Kingdom" error={errors.country} required />
          </div>

          <div className="form-row">
            <InputField id="type" label="Property Type" error={errors.type} required>
              <select id="type" className={`input-field filter-select ${errors.type ? 'input-error' : ''}`}
                value={form.type} onChange={handleChange}>
                <option value="">Select type...</option>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </InputField>

            <InputField id="listingType" label="Listing Type" error={errors.listingType} required>
              <select id="listingType" className={`input-field filter-select ${errors.listingType ? 'input-error' : ''}`}
                value={form.listingType} onChange={handleChange}>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </InputField>
          </div>

          <InputField id="imageUrls" label="Image URLs (comma-separated)" value={form.imageUrls}
            onChange={handleChange} placeholder="https://example.com/img1.jpg, https://..." />

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="create-property-submit">
              {loading ? 'Creating...' : '🏠 Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePropertyPage;
