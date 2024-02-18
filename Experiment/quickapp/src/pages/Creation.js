import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import '../css/Creation.css';
// import EditableItem from '../helpers/editable.js';

// predefined background colors for sentences background
// const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
const colors = ['#fff3c6'];


const Creation = () => {
  const [creationItems, setCreationItems] = useState([]);

  useEffect(() => {
    const storedCreationItems = localStorage.getItem('creationItems');
    const storedPositions = JSON.parse(localStorage.getItem('creationPositions')) || {};
    if (storedCreationItems) {
      const itemsWithPosition = JSON.parse(storedCreationItems).map(item => ({
        ...item,
        position: storedPositions[item.id] || {x: 0, y: 0},
      }));
      setCreationItems(itemsWithPosition);
    }
  }, []);

  // clear button
  const clearCreationItems = () => {
    localStorage.removeItem('creationItems'); // Clear sentences
    localStorage.removeItem('creationPositions'); // Also clear positions
    setCreationItems([]); // Reset state
  };
  
  // reset button
  const resetPositions = () => {
    localStorage.removeItem('creationPositions'); // Clear only positions
    // Reset positions in state to default (e.g., center)
    const resetItems = creationItems.map(item => ({
      ...item,
      position: {x: 0, y: 0}, // Assuming {x: 0, y: 0} centers the item
    }));
    setCreationItems(resetItems);
    
    // reload the page
    window.location.reload();
  };
  
  // Function to update the text of an item
  const handleUpdateItemText = (itemId, newText) => {
    const updatedItems = creationItems.map(item => {
      if (item.id === itemId) {
        return { ...item, hitokoto: newText };
      }
      return item;
    });
  
    setCreationItems(updatedItems);
    localStorage.setItem('creationItems', JSON.stringify(updatedItems)); // Save changes
  };
  

  // Function to determine the background color based on the item ID
  const backgroundColorForItem = (itemId) => {
    // Use mod function to choose a color from the array
    const colorIndex = itemId % colors.length;
    return colors[colorIndex];
  };

  // Function to determine width based on sentence length
  const widthForItem = (sentence) => {
    const baseWidth = 200; // Base width in pixels
    const widthPerCharacter = 10; // Additional width per character
    return `${baseWidth + sentence.length * widthPerCharacter}px`;
  };

  const handleStop = (e, data, itemId) => {
    // Save the new position in localStorage
    const storedPositions = JSON.parse(localStorage.getItem('creationPositions')) || {};
    storedPositions[itemId] = { x: data.x, y: data.y };
    localStorage.setItem('creationPositions', JSON.stringify(storedPositions));
  };

  return (
    <div className="creation-container">
      <div className='buttons-container'>
        <button onClick={resetPositions} className='creation-reset'>归位</button>
        <button onClick={clearCreationItems} className='creation-reset'>清空</button>
      </div>
      <div className='items-container'></div>
      {creationItems.length > 0 ? (
        creationItems.map((item, index) => (
          <Draggable 
            key={index}
            defaultPosition={item.position}
            onStop={(e, data) => handleStop(e, data, item.id)}
          >
            <div
              className="draggable-item"
              style={{
                backgroundColor: backgroundColorForItem(item.id),
                width: widthForItem(item.hitokoto), // Set width based on sentence length
              }}
            >
              {item.hitokoto}
            </div>
          </Draggable>
        ))
      ) : (
        <p>从“集”开始</p>
      )}
    </div>
  );

};

export default Creation;
