import { useState, useEffect } from 'react';
import ShoppingList from '../ShoppingList';
import AddItem from '../AddItem';

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/items')
      .then((response) => response.json())
      .then((data) => {
        const itemNames = data.map((item) => item.name);
        setItems(itemNames);
        setLoading(false);
      });
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