import { useState } from "react";

function AddItem({ onAdd }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue === '') return;
    onAdd(inputValue);
    setInputValue('');
  };

  return (
    <div>
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
