import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/App.css';
import YoutubeSearch from './Youtube.js';

function Chat({keyword }) {
  const [wikiresults, setWikiResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/qa_chat', { keyword });
        setWikiResults(response.data.answer);
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
      Results from AI TUTOR :<br />
      <p>{wikiresults}</p>
      <YoutubeSearch keyword={keyword+ "Educational Videos"} />
    </div>
  );
}

export default Chat;