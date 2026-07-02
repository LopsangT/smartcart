import { useState, useEffect } from 'react';
import ShoppingList from '../ShoppingList';
import AddItem from '../AddItem';

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch('http://localhost:8080/api/items')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  };

  const addItem = (name) => {
    fetch('http://localhost:8080/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, quantity: 1 }),
    })
      .then((response) => response.json())
      .then((newItem) => {
        setItems([...items, newItem]);
      });
  };

  const deleteItem = (id) => {
    fetch(`http://localhost:8080/api/items/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setItems(items.filter((item) => item.id !== id));
      });
  };

  const clearAll = () => {
    items.forEach((item) => {
      fetch(`http://localhost:8080/api/items/${item.id}`, {
        method: 'DELETE',
      });
    });
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