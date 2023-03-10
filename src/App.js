import React from 'react';
import AutoSuggest from "./components/AutoSuggest";

const App = () => {
  const fetchSuggestions = async value => {
    try {
      const apiKey = "43P9bg9AOKo4CVg1uQtdYHsiCj3jbQeF";
      const url = `https://api.apilayer.com/google_search?q=${value}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { "apikey": apiKey }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
      }
      const results = await response.json();
  
      return results.organic.map(result => result.title);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleSuggestionSelection = suggestion => {
    console.log(`Nie zrozumiałem co ta funkcja powinna robić. Wybrana sugestia to: ${suggestion}`)
  }

  return (
    <>
      <AutoSuggest 
        suggestionProvider={fetchSuggestions} 
        onSuggestionSelected={handleSuggestionSelection}
      />
    </>
  );
};

export default App;
