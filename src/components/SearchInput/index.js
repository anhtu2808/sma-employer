import React from 'react';
import './SearchInput.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '../../utils/icons';

const SearchInput = ({ 
    placeholder = 'Search...', 
    value = '',
    onChange = () => {},
    onSearch = () => {},
    className = '',
    size = 'md',
    ...props 
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch(value);
        }
    };

    const handleSearchClick = () => {
        onSearch(value);
    };

    return (
        <div className={`search-input-wrapper search-input-${size} ${className}`}>
            <div className="search-input-container">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                <input
                    type="search"
                    className="search-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    {...props}
                />
                <button 
                    type="button"
                    className="search-button"
                    onClick={handleSearchClick}
                    aria-label="Search"
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </div>
    );
};

export default SearchInput;
