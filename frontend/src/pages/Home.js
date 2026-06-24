import { useState, useEffect } from 'react';
import ShoppingList from '../ShoppingList';
import AddItem from '../AddItem';

function Home() {
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

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <div className="container">
      <h2>My Shopping List</h2>
      {loading ? (
        <p>Loading your list...</p>
      ) : (
        <>
          <AddItem onAdd={addItem} />
          <ShoppingList
            items={items}
            onDelete={deleteItem}
            onClearAll={clearAll}
          />
        </>
      )}
    </div>
  );
}

export default Home;