// src/Refresh.js
import React, { useState, useEffect } from 'react';
import '../css/Refresh.css';
import '../App.css';

function Refresh() {
  const [items, setItems] = useState([]);

  // Function to load and randomly select ten items
  const loadAndSelectItems = () => {
    fetch('data/sentences-bundle/sentences/d.json') // Adjust the path if your JSON is located elsewhere
      .then((response) => response.json())
      .then((data) => {
        // Randomly select ten items
        const selectedItems = [];
        for (let i = 0; i < 5; i++) {
          const randomIndex = Math.floor(Math.random() * data.length);
          selectedItems.push(data[randomIndex]);
        }
        setItems(selectedItems);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
      });
  };

  // Load data on component mount
  useEffect(() => {
    loadAndSelectItems();
  }, []);

  return (
    <div className="refresh-container">
      <h2>选</h2>
      {items.map((item, index) => (
        <div key={index} className="item">
          <p>{item.hitokoto}</p>
          {/* Display other item details as needed */}
        </div>
      ))}
      <button onClick={loadAndSelectItems} className="refresh-button">换</button>
    </div>
  );
}

export default Refresh;
