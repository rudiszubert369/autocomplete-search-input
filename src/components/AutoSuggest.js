import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faHourglass } from '@fortawesome/free-regular-svg-icons';
import styles from './AutoSuggest.module.scss'

const AutoSuggest = ({ suggestionProvider, onSuggestionSelected }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debounceTimeout = useRef(null);
  const suggestionsRef = useRef(null);
  const maxSuggestions = 4;

  const handleClickOutside = event => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.length >= 3 && !suggestions.length) {//fetch only when suggestions are empty
      debounceTimeout.current = setTimeout(() => {
        setIsFetching(true);
        suggestionProvider(value).then(suggestions => {
          const slicedSuggestions = suggestions.slice(0, maxSuggestions);
          setSuggestions(slicedSuggestions);
          setIsFetching(false);
          document.addEventListener("click", handleClickOutside);

          if (suggestions.length === 1) {
            setValue(suggestions[0])
          }
        });
      }, 2000);   
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [value, suggestionProvider]);

  const handleInputChange = event => {
    setValue(event.target.value);
    setSuggestions([]);//hide suggestions when user is typing
  };

  const handleSuggestionClick = suggestion => {
    setValue(suggestion);
    onSuggestionSelected(suggestion); //I was not sure what this should do so I just added it blindly as it was in task
    setSuggestions([]);
  };

  const handleKeyDown = event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (selectedIndex === suggestions.length - 1) {
        setSelectedIndex(0);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (selectedIndex <= 0) {
        setSelectedIndex(suggestions.length - 1);
      } else {
        setSelectedIndex(selectedIndex - 1);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (selectedIndex !== null) {
        handleSuggestionClick(suggestions[selectedIndex]);
      }
    }
  };

  const suggestionList = suggestions.map((suggestion, index) => (
    <li key={index}
      className={styles.listItem}
      style={{ 
        backgroundColor: index === selectedIndex ? '#3f51b5' : '',
        color: index ===  selectedIndex ? 'white' : ''}}
    >
      <button onClick={() => handleSuggestionClick(suggestion)} className={styles.button}>
        <FontAwesomeIcon
          icon={faLightbulb}
          className={ styles.icon }
      />
        {suggestion}
      </button>
    </li>
  ));

  return (
    <div className={styles.wrapper}>
      {isFetching && (
        <FontAwesomeIcon
          icon={faHourglass}
          className={styles.spinner}
        />
      )}
      <input
        type="text"
        ref={suggestionsRef}
        value={value}
        className={styles.input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label="Search input with auto-suggestions"
      />
      <ul ref={suggestionsRef} className={`${styles.list} ${suggestions.length > 0 ? styles.show : ''}`}>
        {suggestionList}
      </ul>
    </div>
  );
};

AutoSuggest.propTypes = {
  suggestionProvider: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired
};

export default AutoSuggest;