import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../api/api';

const defaultImg = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        if (!cancelled) setProperty(data.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load property');
      } finally { if (!cancelled) setLoading(false); }
    };
    fetch();
    return () => { cancelled = true; };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing permanently?')) return;
    setDeleting(true);
    try { await api.delete(`/properties/${id}`); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Failed to delete'); setDeleting(false); }
  };

  const fmt = (p) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);

  if (loading) return <div className="page-centered"><LoadingSpinner message="Loading property..." /></div>;
  if (error) return <div className="page-centered"><ErrorMessage message={error} /></div>;
  if (!property) return null;

  const images = property.imageUrls?.length ? property.imageUrls : [defaultImg];
  const isOwner = user && user.id === property.author?._id;

  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="gallery">
          <img src={images[activeImg]} alt={property.title} className="gallery-main" onError={(e) => { e.target.src = defaultImg; }} />
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, i) => <img key={i} src={img} alt={`View ${i+1}`} className={`thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)} onError={(e) => { e.target.src = defaultImg; }} />)}
            </div>
          )}
        </div>
        <div className="detail-info">
          <div className="detail-badges">
            <span className={`listing-badge ${property.listingType}`}>{property.listingType === 'rent' ? 'For Rent' : 'For Sale'}</span>
            <span className="type-badge">{property.type}</span>
          </div>
          <h1 className="detail-title">{property.title}</h1>
          <p className="detail-location">📍 {property.city}, {property.country}</p>
          <div className="detail-price">{fmt(property.price)}{property.listingType === 'rent' && <span className="price-period">/month</span>}</div>
          <div className="detail-section">
            <h2>Description</h2>
            <p className="detail-description">{property.description}</p>
          </div>
          <div className="detail-section">
            <h2>Listed By</h2>
            <div className="detail-author">
              <div className="author-avatar large">
                {property.author?.avatar ? <img src={property.author.avatar} alt={property.author.username} /> : <span>{property.author?.username?.[0]?.toUpperCase()}</span>}
              </div>
              <div>
                <p className="author-name">{property.author?.username}</p>
                {property.author?.phone && <p className="author-phone">📞 {property.author.phone}</p>}
                <p className="author-email">✉️ {property.author?.email}</p>
              </div>
            </div>
          </div>
          {isOwner && (
            <div className="detail-actions">
              <Link to={`/edit-property/${property._id}`} className="btn btn-secondary" id="edit-property-btn">✏️ Edit Listing</Link>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting} id="delete-property-btn">
                {deleting ? 'Deleting...' : '🗑️ Delete Listing'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
