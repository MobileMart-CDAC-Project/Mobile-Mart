import React, { useState } from 'react';

const SearchAndFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilter = () => {
    onFilter({
      minPrice: priceRange.min ? parseFloat(priceRange.min) : null,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : null
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    onSearch('');
    onFilter({ minPrice: null, maxPrice: null });
  };

  return (
    <div className="search-filter-container mb-4">
      <div className="row g-3">
        {/* Search Bar */}
        <div className="col-md-6">
          <form onSubmit={handleSearch} className="d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-outline-primary ms-2">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>

        {/* Price Filter */}
        <div className="col-md-4">
          <div className="row g-2">
            <div className="col-6">
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Min ₹"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              />
            </div>
            <div className="col-6">
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Max ₹"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="col-md-2">
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleFilter}
            >
              Filter
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;