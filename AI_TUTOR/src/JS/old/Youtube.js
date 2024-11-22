import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/App.css';

function YoutubeSearch({ keyword }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await axios.post('http://localhost:5001/search', { keyword });
        setResults(response.data.youtube);
        console.log(results);
      } catch (error) {
        console.error(error);
      }
      
      
    };

    if (keyword) {
      fetchData(); // Only fetch if a keyword is provided
    }
  }, [keyword]); // Dependency array for keyword changes

  return (
    <>
      Results From Youtube :<br/>
          {results.map((result, index) => (
            result.link ? ( <div style={{padding:'5px'}}>
                <iframe width="330" height="180" src={`https://www.youtube.com/embed/${result.link}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
               
               </div>
            ) : null // If result.link is None or undefined, don't render the row <p>{result.Title}</p>
          ))}
    </>
  );
}

export default YoutubeSearch;