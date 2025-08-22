import React, { useState, useEffect } from 'react';
import { Genre } from '../types';

interface SearchAndFilterProps {
  onSearch: (search: string) => void;
  onGenreFilter: (genre: string) => void;
  genres: Genre[];
  currentSearch: string;
  currentGenre: string;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onGenreFilter,
  genres,
  currentSearch,
  currentGenre
}) => {
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounced search - search as user types with a small delay
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onGenreFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    onSearch('');
    onGenreFilter('');
  };

  return (
    <div className="search-and-filter">
      <div className="search-filter-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search books, authors, or descriptions..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </div>
        </form>

        <div className="filter-controls">
          <select
            value={currentGenre}
            onChange={handleGenreChange}
            className="genre-filter"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name} ({genre.book_count})
              </option>
            ))}
          </select>

          {(currentSearch || currentGenre) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {(currentSearch || currentGenre) && (
        <div className="active-filters">
          <span className="filter-label">Active filters:</span>
          {currentSearch && (
            <span className="filter-tag">
              Search: "{currentSearch}"
              <button onClick={() => onSearch('')} className="remove-filter">×</button>
            </span>
          )}
          {currentGenre && (
            <span className="filter-tag">
              Genre: {currentGenre}
              <button onClick={() => onGenreFilter('')} className="remove-filter">×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
