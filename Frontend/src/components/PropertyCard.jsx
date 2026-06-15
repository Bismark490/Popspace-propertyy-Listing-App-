import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const defaultImg = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80';

const PropertyCard = ({ property }) => {
  const { user } = useAuth();
  const fmt = (p) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="property-card">
      <Link to={`/properties/${property._id}`} className="card-image-link">
        <div className="card-image-wrap">
          <img src={property.imageUrls?.[0] || defaultImg} alt={property.title} className="card-image"
            onError={(e) => { e.target.src = defaultImg; }} />
          <span className={`listing-badge ${property.listingType}`}>{property.listingType === 'rent' ? 'For Rent' : 'For Sale'}</span>
          <span className="type-badge">{property.type}</span>
        </div>
      </Link>
      <div className="card-body">
        <div className="card-price">{fmt(property.price)}{property.listingType === 'rent' ? '/mo' : ''}</div>
        <Link to={`/properties/${property._id}`} className="card-title-link">
          <h3 className="card-title">{property.title}</h3>
        </Link>
        <p className="card-location"><span>📍</span> {property.city}, {property.country}</p>
        <p className="card-description">{property.description?.slice(0, 90)}...</p>
        <div className="card-footer">
          <div className="card-author">
            <div className="author-avatar">
              {property.author?.avatar ? <img src={property.author.avatar} alt={property.author.username} /> : <span>{property.author?.username?.[0]?.toUpperCase()}</span>}
            </div>
            <span>{property.author?.username}</span>
          </div>
          {user && user.id === property.author?._id && <div className="card-owner-badge">Yours</div>}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
