import React, { useState } from 'react';
import Draggable from 'react-draggable';

const EditableItem = ({ item, onStop, backgroundColor, width }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.hitokoto);

  const handleDoubleClick = () => {
    console.log('handleDoubleClick');
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Optionally, update the parent component/state with the new text here
  };

  const handleChange = (e) => {
    setText(e.target.innerText);
  };

  return (
    <Draggable 
      key={item.id}
      defaultPosition={item.position}
      onStop={(e, data) => onStop(e, data, item.id)}
    >
      <div
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onInput={handleChange}
        className="draggable-item"
        style={{
          backgroundColor: backgroundColor,
          width: width, // Adjust width based on content
        }}
      >
        {text}
      </div>
    </Draggable>
  );
};


export default EditableItem;