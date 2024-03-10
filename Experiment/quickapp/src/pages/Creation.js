import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import '../css/Creation.css';
import html2canvas from 'html2canvas'; // new import for output image
// import EditableItem from '../helpers/editable.js';

// predefined background colors for sentences background
// const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
const colors = ['#fff3c6'];


const Creation = () => {
  const [creationItems, setCreationItems] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState('#F9EDD2');
  const [title, setTitle] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null); // State for background image
  const [showOptions, setShowOptions] = useState(false); // State to toggle the visibility of options

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
  // function for image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result); // This will be a base64 encoded string of the image
      };
      reader.readAsDataURL(file);
    }
  };

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
  // Function to output image after the creation
  const savePoemAsImage = () => {
    document.getElementById('title-input').style.visibility = 'hidden';
    document.getElementById('file-input').style.visibility = 'hidden';
    document.getElementById('color-input').style.visibility = 'hidden';
    document.querySelectorAll('.creation-reset').forEach(element => {
      element.style.visibility = 'hidden';
    });
  
    html2canvas(document.getElementById("poem-container")).then((canvas) => {
      document.getElementById('title-input').style.visibility = 'visible';
      document.getElementById('color-input').style.visibility = 'visible';
      document.getElementById('file-input').style.visibility = 'visible';
      document.querySelectorAll('.creation-reset').forEach(element => {
        element.style.visibility = 'visible';
      });
      // console.log("Title before capture:", title)
      const ctx = canvas.getContext('2d');
      ctx.textAlign = 'center';
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle='black';
      ctx.fillText(title, canvas.width / 2 + 200, 150);
      console.log(ctx)
  
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'poem-image.png';
      link.click();
    });
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
    <div className="creation-container"id="poem-container" style={{backgroundColor: backgroundColor,
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundSize: 'cover', width: '1500px', height: '800px'}}>

      <div className='buttons-container'>
        <button onClick={() => setShowOptions(!showOptions)} className='creation-reset'>主题</button>
        <button onClick={resetPositions} className='creation-reset'>归位</button>
        <button onClick={clearCreationItems} className='creation-reset'>清空</button>
      </div>
      {showOptions && (
        <div>
          <input type="text" id="title-input" placeholder="Poem Title" onChange={(e) => setTitle(e.target.value)} />
          <input type="color" id='color-input' onChange={(e) => setBackgroundColor(e.target.value)}/>
          <input type="file" id='file-input' accept="image/*" onChange={handleImageUpload} />
          <button onClick={() => savePoemAsImage(title)} className='creation-reset'>保存</button> {/* Add this line */}
        </div>
      )}
      
      <div className='items-container'></div>
      {creationItems.length > 0 ? (
        creationItems.map((item, index) => (
          <Draggable 
            key={index}
            defaultPosition={item.position}
            onStop={(e, data) => handleStop(e, data, item.id)}
            // bounds={{left: -250, top: 0-, right: 750, bottom: 800}}
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
