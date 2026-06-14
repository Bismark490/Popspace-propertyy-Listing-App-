import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../api/api';

const PROPERTY_TYPES = ['Apartment', 'House', 'Studio'];

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', price: '', city: '', country: '',
    type: '', listingType: 'rent', imageUrls: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        if (!cancelled) {
          const p = data.data;
          setForm({
            title: p.title,
            description: p.description,
            price: p.price,
            city: p.city,
            country: p.country,
            type: p.type,
            listingType: p.listingType,
            imageUrls: p.imageUrls?.join(', ') || '',
          });
        }
      } catch (err) {
        if (!cancelled) setServerError(err.response?.data?.message || 'Failed to load property');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProperty();
    return () => { cancelled = true; };
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim() || form.title.length < 5) errs.title = 'Title must be at least 5 characters';
    if (!form.description.trim() || form.description.length < 10) errs.description = 'Description must be at least 10 characters';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) errs.price = 'Enter a valid price';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.country.trim()) errs.country = 'Country is required';
    if (!form.type) errs.type = 'Select a property type';
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

    setSaving(true);
    try {
      const imageUrls = form.imageUrls
        ? form.imageUrls.split(',').map((u) => u.trim()).filter(Boolean)
        : [];
      await api.put(`/properties/${id}`, { ...form, price: Number(form.price), imageUrls });
      navigate(`/properties/${id}`);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-centered"><LoadingSpinner message="Loading property..." /></div>;

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">✏️ Edit Listing</h1>
          <p className="form-subtitle">Update your property details</p>
        </div>

        {serverError && <div className="server-error-banner"><span>⚠️</span> {serverError}</div>}

        <form className="property-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <InputField id="title" label="Property Title" value={form.title} onChange={handleChange}
              placeholder="Property title" error={errors.title} required />
            <InputField id="price" label="Price (USD)" type="number" value={form.price} onChange={handleChange}
              placeholder="e.g. 1200" error={errors.price} required min="0" />
          </div>

          <InputField id="description" label="Description" error={errors.description} required>
            <textarea id="description" className={`input-field textarea ${errors.description ? 'input-error' : ''}`}
              value={form.description} onChange={handleChange} rows={4} />
          </InputField>

          <div className="form-row">
            <InputField id="city" label="City" value={form.city} onChange={handleChange} error={errors.city} required />
            <InputField id="country" label="Country" value={form.country} onChange={handleChange} error={errors.country} required />
          </div>

          <div className="form-row">
            <InputField id="type" label="Property Type" error={errors.type} required>
              <select id="type" className={`input-field filter-select ${errors.type ? 'input-error' : ''}`}
                value={form.type} onChange={handleChange}>
                <option value="">Select type...</option>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </InputField>
            <InputField id="listingType" label="Listing Type">
              <select id="listingType" className="input-field filter-select" value={form.listingType} onChange={handleChange}>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </InputField>
          </div>

          <InputField id="imageUrls" label="Image URLs (comma-separated)" value={form.imageUrls}
            onChange={handleChange} placeholder="https://..." />

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving} id="save-property-btn">
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyPage;
