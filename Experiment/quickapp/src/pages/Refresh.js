// src/Refresh.js
import React, { useState, useEffect } from 'react';
import '../css/Refresh.css';
import '../App.css';

function Refresh() {
  const [items, setItems] = useState([]);
  const [activeItemIds, setActiveItemIds] = useState([]);

  // Helper function to read stored items from localStorage
  const getStoredItems = () => {
    const stored = localStorage.getItem('storedItems');
    return stored ? JSON.parse(stored) : [];
  };

  const storeItem = (item) => {
    const storedItems = getStoredItems();
    if (!storedItems.some(storedItem => storedItem.id === item.id)) {
      const updatedItems = [...storedItems, item];
      localStorage.setItem('storedItems', JSON.stringify(updatedItems));
      setActiveItemIds(prev => [...prev, item.id]); // Mark as active
    }
  };

  const removeItem = (item) => {
    let storedItems = getStoredItems();
    storedItems = storedItems.filter(storedItem => storedItem.id !== item.id);
    localStorage.setItem('storedItems', JSON.stringify(storedItems));
    setActiveItemIds(prev => prev.filter(id => id !== item.id)); // Remove from active
  };

  const handleLeftClick = (item, event) => {
    event.preventDefault(); // Prevent default click behavior
    const isAlreadyActive = activeItemIds.includes(item.id);

    if (isAlreadyActive) {
      removeItem(item);
    } else {
      storeItem(item);
    }
  };

  // Function to load and randomly select items
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
    // Initialize activeItemIds from localStorage
    const storedItems = getStoredItems();
    setActiveItemIds(storedItems.map(item => item.id));
  }, []);

  return (
    <div className="refresh-container">
      <h2>选</h2>

      {items.map(item => (
        <p key={item.id} 
           className={`item ${activeItemIds.includes(item.id) ? 'active' : ''}`}
           onClick={(e) => handleLeftClick(item, e)} >
           {item.hitokoto}
        </p>
      ))}
      
      <button onClick={loadAndSelectItems} className="refresh-button">换</button>
    </div>
  );
}

export default Refresh;
