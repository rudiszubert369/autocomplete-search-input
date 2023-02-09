import { useState, useEffect, useRef } from "react";
import styles from './AutoSuggest.module.scss'

const AutoSuggest = ({ suggestionProvider }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [isSuggestionSelected, setIsSuggestionSelected] = useState(false)
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.length >= 3 && !showSuggestions) {
      debounceTimeout.current = setTimeout(() => {
        suggestionProvider(value).then(suggestions => {
          setSuggestions(suggestions);
          setShowSuggestions(true);
          
          // setIsSuggestionSelected(true)
        });
      }, 3000);   
    }
  }, [value, suggestionProvider]);

  const handleInputChange = event => {
    setValue(event.target.value);
    setShowSuggestions(false);

    // setIsSuggestionSelected(false);
  };

  const handleSuggestionClick = suggestion => {
    setValue(suggestion);
    setShowSuggestions(false);
  };

  const suggestionList = suggestions.map((suggestion, index) => (
    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
      {suggestion}
    </li>
  ));

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        value={value}
        className={styles.input}
        onChange={handleInputChange}
      />
      {showSuggestions && (
        <ul className={styles.list}>{suggestionList}</ul>
      )}
    </div>
  );
};

export default AutoSuggest;