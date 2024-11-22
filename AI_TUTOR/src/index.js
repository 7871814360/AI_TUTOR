import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './JS/login.js';

const login = ReactDOM.createRoot(document.getElementById('login'));
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
login.render(
  <React.StrictMode>  
    <Login />
  </React.StrictMode>
);

const renderScript = async () => {
  await sleep(2000); // Wait for 2 seconds
  const script = document.createElement('script');
  script.src = './script.js';
  document.body.appendChild(script);
};

renderScript();
