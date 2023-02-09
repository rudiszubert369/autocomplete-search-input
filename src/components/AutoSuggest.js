import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileZipper, faHourglass } from '@fortawesome/free-regular-svg-icons';
import styles from './AutoSuggest.module.scss'

const AutoSuggest = ({ suggestionProvider }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
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
          setSuggestions(suggestions);
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
      }
    };


    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    
  }, [value, suggestionProvider]);

  const handleInputChange = event => {
    setValue(event.target.value);
    setSuggestions([])
    setShowSuggestions(false);
  };

  const handleSuggestionClick = suggestion => {
    setValue(suggestion);
    setShowSuggestions(false);
  };

  const suggestionList = suggestions.map((suggestion, index) => (//TODO LUPA
    <li key={index} className={styles.listItem} onClick={() => handleSuggestionClick(suggestion)}>
      <FontAwesomeIcon
          icon={faFileZipper}
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
        value={value}
        className={styles.input}
        onChange={handleInputChange}
      />

      {showSuggestions && (
        <ul ref={suggestionsRef} className={styles.list}>{suggestionList}</ul>
      )}
    </div>
  );
};

export default AutoSuggest;