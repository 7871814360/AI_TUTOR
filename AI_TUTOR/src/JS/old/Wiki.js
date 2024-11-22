import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/App.css';

function Wiki({ keyword }) {
  const [wikiresults, setWikiResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/search_wiki', { keyword });
        setWikiResults(response.data.wiki);
        console.log(wikiresults);
      } catch (error) {
        console.error(error);
      }
      
      
    };

    if (keyword) {
      fetchData(); // Only fetch if a keyword is provided
    }
  }, [keyword]); // Dependency array for keyword changes

  return (
    <div>
      Results from Wikipedia :<br />
      {wikiresults}
    </div>
  );
}

export default Wiki;