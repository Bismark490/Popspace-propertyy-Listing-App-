import { useState } from 'react';

const FilterSidebar = ({ onFilter }) => {
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [type, setType] = useState('');
  const [listingType, setListingType] = useState('');

  const handleSubmit = (e) => { e.preventDefault(); onFilter({ city, minPrice, maxPrice, type, listingType }); };
  const handleReset = () => { setCity(''); setMinPrice(''); setMaxPrice(''); setType(''); setListingType(''); onFilter({}); };

  return (
    <aside className="filter-sidebar">
      <h2 className="filter-title">🔍 Filter Properties</h2>
      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="filter-group">
          <label htmlFor="filter-city">City</label>
          <input id="filter-city" type="text" placeholder="e.g. London" value={city} onChange={(e) => setCity(e.target.value)} className="filter-input" />
        </div>
        <div className="filter-group">
          <label>Price Range (USD)</label>
          <div className="price-range">
            <input id="filter-min-price" type="number" placeholder="Min" value={minPrice} min="0" onChange={(e) => setMinPrice(e.target.value)} className="filter-input" />
            <span className="range-sep">–</span>
            <input id="filter-max-price" type="number" placeholder="Max" value={maxPrice} min="0" onChange={(e) => setMaxPrice(e.target.value)} className="filter-input" />
          </div>
        </div>
        <div className="filter-group">
          <label htmlFor="filter-type">Property Type</label>
          <select id="filter-type" value={type} onChange={(e) => setType(e.target.value)} className="filter-select">
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Studio">Studio</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="filter-listing-type">Listing Type</label>
          <select id="filter-listing-type" value={listingType} onChange={(e) => setListingType(e.target.value)} className="filter-select">
            <option value="">All</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary filter-btn">Apply Filters</button>
        <button type="button" className="btn btn-ghost filter-btn" onClick={handleReset}>Reset</button>
      </form>
    </aside>
  );
};

export default FilterSidebar;
