import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm  }) => {
  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search by tag"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;