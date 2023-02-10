import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faHourglass } from '@fortawesome/free-regular-svg-icons';
import styles from './AutoSuggest.module.scss'

const AutoSuggest = ({ suggestionProvider }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debounceTimeout = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.length >= 3 && !suggestions.length) {
      debounceTimeout.current = setTimeout(() => {
        setIsFetching(true);

        suggestionProvider(value).then(suggestions => {
          const slicedSuggestions = suggestions.slice(0, 4);//max 4 suggestions
          setSuggestions(slicedSuggestions);
          setShowSuggestions(true);
          setIsFetching(false);
          document.addEventListener("click", handleClickOutside);

          if (suggestions.length === 1) {
            setValue(suggestions[0])
          }
        });
      }, 2000);   
    }

    const handleClickOutside = event => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    };


    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    
  }, [value, suggestionProvider]);

  const handleInputChange = event => {
    setValue(event.target.value);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = suggestion => {
    setValue(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = event => {

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (selectedIndex === null || selectedIndex === suggestions.length - 1) {
        setSelectedIndex(0);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (selectedIndex === null || selectedIndex <= 0) {
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
      onClick={() => handleSuggestionClick(suggestion)}
      style={{ 
        backgroundColor: index === selectedIndex ? '#3f51b5' : '',
        color: index ===  selectedIndex ? 'white' : ''}}
    >
      <FontAwesomeIcon
          icon={faLightbulb}
          className={ styles.icon }
      />
      {suggestion}
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
      />
      {showSuggestions && (
        <ul ref={suggestionsRef} className={styles.list}>{suggestionList}</ul>
      )}
    </div>
  );
};

export default AutoSuggest;