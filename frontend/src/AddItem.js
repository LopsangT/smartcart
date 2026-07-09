import { useState } from 'react';
import './styles/AddItem.css';

function AddItem({ onAdd }) {
  const [inputValue, setInputValue] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = () => {
    if (inputValue === '') return;
    onAdd(inputValue, price === '' ? 0 : parseFloat(price));
    setInputValue('');
    setPrice('');
  };

  return (
    <div className="add-item">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add an item..."
      />
      <input
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        min="0"
        step="0.01"
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddItem;
