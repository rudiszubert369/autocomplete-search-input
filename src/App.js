import React from 'react';
import AutoSuggest from "./components/AutoSuggest";

const App = () => {//TODO test
  const suggestionProvider = async value => {
    const apiHeaders = new Headers();
    apiHeaders.append("apikey", "43P9bg9AOKo4CVg1uQtdYHsiCj3jbQeF");
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: apiHeaders
    };

    const response = await fetch(`https://api.apilayer.com/google_search?q=${value}`, requestOptions);
    const results = await response.json();
    const titles = results.organic.map(result => result.title);

    return titles;
  };

  return (
    <>
        <AutoSuggest suggestionProvider={suggestionProvider} />
    </>
  );
};

export default App;
