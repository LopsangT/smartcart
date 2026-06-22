import { useState, useEffect } from 'react';
import ShoppingList from './ShoppingList';
import AddItem from './AddItem';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setItems(['milk', 'eggs', 'bread']);
      setLoading(false);
    }, 2000);
  }, []);
  
  const addItem = (newItem) => {
    setItems([...items, newItem]);
  };

  return (
    <div>
      <h1>SmartCart 🛒</h1>
      {loading ? (
        <p>Loading your list...</p>
      ) : (
        <>
          <AddItem onAdd={addItem} />
          <ShoppingList items={items} />
        </>
      )}
    </div>
  );
}

export default App;