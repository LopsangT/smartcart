import { useState, useEffect } from 'react';
import ShoppingList from '../ShoppingList';
import AddItem from '../AddItem';
import AISuggestions from '../AISuggestions';

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch('http://localhost:8080/api/items', {
      headers: getAuthHeader(),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Items received:', data);
        setItems(data);
        setLoading(false);
      });
  };

  const addItem = (name, price) => {
    fetch('http://localhost:8080/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ name: name, quantity: 1, price: price }),
    })
      .then((response) => response.json())
      .then((newItem) => {
        setItems([...items, newItem]);
      });
  };

  const deleteItem = (id) => {
    fetch(`http://localhost:8080/api/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    })
      .then(() => {
        setItems(items.filter((item) => item.id !== id));
      });
  };

  const clearAll = () => {
    items.forEach((item) => {
      fetch(`http://localhost:8080/api/items/${item.id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
    });
    setItems([]);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    fetch(`http://localhost:8080/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Update failed');
        return response.json();
      })
      .then((updatedItem) => {
        setItems(
          items.map((item) => (item.id === id ? updatedItem : item))
        );
      })
      .catch((error) => console.error(error));
  };

  const updatePrice = (id, newPrice) => {
    const parsed = parseFloat(newPrice);
    if (isNaN(parsed) || parsed < 0) return;

    fetch(`http://localhost:8080/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ price: parsed }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Update failed');
        return response.json();
      })
      .then((updatedItem) => {
        setItems(
          items.map((item) => (item.id === id ? updatedItem : item))
        );
      })
      .catch((error) => console.error(error));
  };

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const getSuggestions = () => {
    setLoadingSuggestions(true);
    fetch('http://localhost:8080/api/items/suggestions', {
      headers: getAuthHeader(),
    })
      .then((response) => response.json())
      .then((data) => {
        const suggestionArray = data.suggestions
          .split(',')
          .map((item) => item.trim());
        setSuggestions(suggestionArray);
        setLoadingSuggestions(false);
      })
      .catch(() => {
        setLoadingSuggestions(false);
      });
  };

  const addSuggestion = (name) => {
    addItem(name, 0);
    setSuggestions(suggestions.filter((s) => s !== name));
  };

  return (
    <div className="container">
      <h2>My Shopping List</h2>
      {loading ? (
        <p>Loading your list...</p>
      ) : (
        <>
          <AddItem onAdd={addItem} />
          <AISuggestions
            suggestions={suggestions}
            loading={loadingSuggestions}
            onGetSuggestions={getSuggestions}
            onAddSuggestion={addSuggestion}
          />
          <ShoppingList
            items={items}
            onDelete={deleteItem}
            onClearAll={clearAll}
            onUpdateQuantity={updateQuantity}
            onUpdatePrice={updatePrice}
          />
        </>
      )}
    </div>
  );
}

export default Home;