import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import '../css/Creation.css';

const Creation = () => {
  const [creationItems, setCreationItems] = useState([]);

  useEffect(() => {
    // Load the creation items from localStorage
    const storedCreationItems = localStorage.getItem('creationItems');
    if (storedCreationItems) {
      setCreationItems(JSON.parse(storedCreationItems));
    }
  }, []);

  const clearCreationItems = () => {
    localStorage.removeItem('creationItems'); // Clear the specific localStorage item
    setCreationItems([]); // Update the state to reflect the change
  };

  return (
    <div className="creation-container">
      <h2>作</h2>
      {creationItems.length > 0 ? (
        creationItems.map((item, index) => (
          <Draggable key={index}>
            <div className="draggable-item">
              {item.hitokoto}
            </div>
          </Draggable>
        ))
      ) : (
        <p>从“集”开始</p>
      )}
      <button onClick={clearCreationItems}>Clear All</button>
    </div>
  );
};

export default Creation;
