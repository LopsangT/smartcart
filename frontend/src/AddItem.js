import { useState } from 'react';
import './styles/AddItem.css';

function AddItem({ onAdd }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue === '') return;
    onAdd(inputValue);
    setInputValue('');
  };

  return (
    <div className="add-item">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add an item..."
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddItem;
