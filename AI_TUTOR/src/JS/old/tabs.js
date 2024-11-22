// src/App.js
import React, { useState } from 'react';
import Chat from './Chat.js';
const App = ({keyword}) => {

  return (
      <div>
      <Chat keyword={keyword+"Condition [Generate response understandable for kids with flow chart interactively.Also MAx response should be within 100 words]"} />
      </div>
  );
};

export default App;