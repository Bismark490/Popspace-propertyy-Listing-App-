import { useState, useEffect, useCallback } from 'react';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import api from '../api/api';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});

  const fetchProperties = useCallback(async (activeFilters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (activeFilters.city) params.append('city', activeFilters.city);
      if (activeFilters.minPrice) params.append('minPrice', activeFilters.minPrice);
      if (activeFilters.maxPrice) params.append('maxPrice', activeFilters.maxPrice);
      if (activeFilters.type) params.append('type', activeFilters.type);
      if (activeFilters.listingType) params.append('listingType', activeFilters.listingType);

      const { data } = await api.get(`/properties?${params.toString()}`);
      setProperties(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mount: fetch properties once
  useEffect(() => {
    fetchProperties(filters);
    return () => {}; // Cleanup
  }, [fetchProperties, filters]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect <span className="gradient-text">Space</span></h1>
          <p className="hero-subtitle">Discover thousands of properties for rent and sale across the globe</p>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">{properties.length}</span><span className="stat-label">Listings</span></div>
            <div className="stat-divider"/>
            <div className="stat"><span className="stat-num">50+</span><span className="stat-label">Cities</span></div>
            <div className="stat-divider"/>
            <div className="stat"><span className="stat-num">100%</span><span className="stat-label">Verified</span></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        <FilterSidebar onFilter={handleFilter} />

        <section className="listings-section">
          <div className="listings-header">
            <h2>{properties.length} Properties Found</h2>
          </div>

          {error && <ErrorMessage message={error} />}

          {loading ? (
            <LoadingSpinner message="Fetching properties..." />
          ) : properties.length === 0 ? (
            <EmptyState
              icon="🏘️"
              title="No Properties Found"
              message="Try adjusting your filters or check back later for new listings."
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
    </div>
  );
};

export default HomePage;
