import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchMyProperties = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/properties/mine');
        if (!cancelled) setProperties(data.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load your listings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMyProperties();

    // Cleanup: prevent state updates after unmount
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <div className="welcome-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <span>{user?.username?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1 className="dashboard-title">My Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, <strong>{user?.username}</strong></p>
          </div>
        </div>
        <Link to="/create-property" className="btn btn-primary" id="create-listing-btn">
          + New Listing
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="dash-stat">
          <span className="dash-stat-num">{properties.length}</span>
          <span className="dash-stat-label">Total Listings</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-num">{properties.filter(p => p.listingType === 'rent').length}</span>
          <span className="dash-stat-label">For Rent</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-num">{properties.filter(p => p.listingType === 'sale').length}</span>
          <span className="dash-stat-label">For Sale</span>
        </div>
      </div>

      <section className="dashboard-listings">
        <h2 className="section-title">My Listings</h2>
        {error && <ErrorMessage message={error} />}
        {loading ? (
          <LoadingSpinner message="Loading your listings..." />
        ) : properties.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No Listings Yet"
            message="Create your first property listing to get started!"
          />
        ) : (
          <div className="properties-grid">
            {properties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
