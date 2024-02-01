// src/Collection.js
import React, { useState, useEffect } from 'react';
import '../css/Collection.css';


// Defining constants
const dDistThres = 50; // Threshold for crossing out(dragDistanceThreshold)


// Function for "swip and delete" functionality
const CollectionItem = ({ item, onToggleCrossOut, onAddToCreation, onRemoveFromCreation}) => {
  const [isCrossedOut, setIsCrossedOut] = useState(false);
  const [isAddedToCreation, setIsAddedToCreation] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);

  
  // ========== Cross-out OR Click  ==========
  const handlePointerDown = (e) => {
    setDragStartX(e.clientX); // Set the starting X position
  };

  const handlePointerUp = (e) => {
    console.log('handleMouseUp')
    const dragDistance = Math.abs(e.clientX - dragStartX);
    if (dragDistance < dDistThres) {
      // It's a click
      const newAddedToCreationState = !isAddedToCreation;
      setIsAddedToCreation(newAddedToCreationState);
      if (newAddedToCreationState) {
        onAddToCreation(item);
      } else {
        onRemoveFromCreation(item);
      }
    } else {
      // It's a swipe
      const newCrossedOutState = !isCrossedOut;
      setIsCrossedOut(newCrossedOutState);
      onToggleCrossOut(item, newCrossedOutState);
    }
  };

  return (
    <p 
      // If this item is crossed out, add the 'crossed-out' class
      // If this item is added to creation, add the 'collection-item.active' class
      className={`collection-item ${isCrossedOut ? 'crossed-out' : ''} ${isAddedToCreation ? 'active' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {item.hitokoto}
    </p>
  );
};


const Collection = () => {
  const [storedItems, setStoredItems] = useState([]);
  const [crossedOutItems, setCrossedOutItems] = useState(new Set());

  // ========== ADD TO CREATION ==========
  const addToCreation = (item) => {
    // Retrieve the current creation items from localStorage
    const currentCreationItems = JSON.parse(localStorage.getItem('creationItems')) || [];
    
    if (!currentCreationItems.some(creationItem => creationItem.id === item.id)) {
      // Add the new item
      const updatedCreationItems = [...currentCreationItems, item];

      // Update localStorage
      localStorage.setItem('creationItems', JSON.stringify(updatedCreationItems));
    }
  };

  const removeFromCreation = (item) => {
    // Retrieve the current creation items from localStorage
    const currentCreationItems = JSON.parse(localStorage.getItem('creationItems')) || [];
    
    // Remove the item
    const updatedCreationItems = currentCreationItems.filter(creationItem => creationItem.id !== item.id);

    // Update localStorage
    localStorage.setItem('creationItems', JSON.stringify(updatedCreationItems));
  };


  // ========== CROSS-OUT EFFECT ==========
  const handleToggleCrossOut = (item, isCrossedOut) => {
    setCrossedOutItems(prev => {
      const newCrossedOut = new Set(prev);
      if (isCrossedOut) {
        newCrossedOut.add(item.id);
      } else {
        newCrossedOut.delete(item.id);
      }
  
      // Update localStorage immediately when the cross-out state changes
      const itemsToKeep = storedItems.filter(storedItem => !newCrossedOut.has(storedItem.id));
      localStorage.setItem('storedItems', JSON.stringify(itemsToKeep));
  
      return newCrossedOut;
    });
  };
  
  // Helper function to read stored items from localStorage
  const getStoredItems = () => {
    const stored = localStorage.getItem('storedItems');
    return stored ? JSON.parse(stored) : [];
  };

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
          onAddToCreation={addToCreation}
          onRemoveFromCreation={removeFromCreation}
        />
      ))}
    </div>
  );
};



export default Collection;
