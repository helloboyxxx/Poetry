// src/Collection.js
import React, { useState, useEffect } from 'react';
import '../css/Collection.css';


// Defining constants
const dDistThres = 50; // Threshold for crossing out(dragDistanceThreshold)


// Function for "swip and delete" functionality
const CollectionItem = ({ item, onToggleCrossOut }) => {
  const [isCrossedOut, setIsCrossedOut] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);

  const handleMouseDown = (e) => {
    setDragStartX(e.clientX); // Set the starting X position
  };

  const handleMouseUp = (e) => {
    const dragEndX = e.clientX;
    if (dragStartX !== null) {
      const dragDistance = dragEndX - dragStartX;
      if (Math.abs(dragDistance) > dDistThres) { // Check if the drag distance exceeds the threshold
        const newCrossedOutState = !isCrossedOut;
        setIsCrossedOut(newCrossedOutState);
        onToggleCrossOut(item, newCrossedOutState);
      }
    }
    setDragStartX(null); // Reset the starting X position
  };

  return (
    <p 
      className={`collection-item ${isCrossedOut ? 'crossed-out' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ cursor: 'grab' }}
    >
      {item.hitokoto}
    </p>
  );
};


const Collection = () => {
  const [storedItems, setStoredItems] = useState([]);
  const [crossedOutItems, setCrossedOutItems] = useState(new Set());

  const handleToggleCrossOut = (item, isCrossedOut) => {
    setCrossedOutItems(prev => {
      const newCrossedOut = new Set(prev);
      if (isCrossedOut) {
        newCrossedOut.add(item.id);
      } else {
        newCrossedOut.delete(item.id);
      }
      return newCrossedOut;
    });
  };

  // Helper function to read stored items from localStorage
  const getStoredItems = () => {
    const stored = localStorage.getItem('storedItems');
    return stored ? JSON.parse(stored) : [];
  };

  // Save the current state to localStorage before unloading the page
  const handlePageUnload = () => {
    const itemsToKeep = storedItems.filter(item => !crossedOutItems.has(item.id));
    localStorage.setItem('storedItems', JSON.stringify(itemsToKeep));
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handlePageUnload);

    return () => {
      window.removeEventListener('beforeunload', handlePageUnload);
    };
  }, [storedItems, crossedOutItems]);

  useEffect(() => {
    const items = getStoredItems();
    setStoredItems(items);
  }, []);

  return (
    <div className="collection-container">
      <h2>集</h2>
      {storedItems.map((item, index) => (
        <CollectionItem 
          key={index} 
          item={item} 
          onToggleCrossOut={handleToggleCrossOut}
        />
      ))}
    </div>
  );
};



export default Collection;
