import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ShoppingList from '../ShoppingList';
import AddItem from '../AddItem';
import AISuggestions from '../AISuggestions';

function Home() {
  const { groupId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const handleAuthError = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const isAuthError = (response) => {
    if (response.status === 401 || response.status === 403) {
      handleAuthError();
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const fetchItems = () => {
    fetch(`http://localhost:8080/api/items/${groupId}`, {
      headers: getAuthHeader(),
    })
      .then((response) => {
        if (isAuthError(response)) return null;
        return response.json();
      })
      .then((data) => {
        if (data === null) return;
        setItems(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  const addItem = (name, price) => {
    fetch(`http://localhost:8080/api/items/${groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ name: name, quantity: 1, price: price }),
    })
      .then((response) => {
        if (isAuthError(response)) return null;
        return response.json();
      })
      .then((newItem) => {
        if (newItem === null) return;
        setItems([...items, newItem]);
      })
      .catch((error) => console.error(error));
  };

  const deleteItem = (id) => {
    fetch(`http://localhost:8080/api/items/item/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    })
      .then((response) => {
        if (isAuthError(response)) return;
        setItems(items.filter((item) => item.id !== id));
      })
      .catch((error) => console.error(error));
  };

  const clearAll = () => {
    items.forEach((item) => {
      fetch(`http://localhost:8080/api/items/item/${item.id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      }).then((response) => {
        isAuthError(response);
      });
    });
    setItems([]);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    fetch(`http://localhost:8080/api/items/item/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((response) => {
        if (isAuthError(response)) return null;
        if (!response.ok) throw new Error('Update failed');
        return response.json();
      })
      .then((updatedItem) => {
        if (updatedItem === null) return;
        setItems(
          items.map((item) => (item.id === id ? updatedItem : item))
        );
      })
      .catch((error) => console.error(error));
  };

  const updatePrice = (id, newPrice) => {
    const parsed = parseFloat(newPrice);
    if (isNaN(parsed) || parsed < 0) return;

    fetch(`http://localhost:8080/api/items/item/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ price: parsed }),
    })
      .then((response) => {
        if (isAuthError(response)) return null;
        if (!response.ok) throw new Error('Update failed');
        return response.json();
      })
      .then((updatedItem) => {
        if (updatedItem === null) return;
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
    fetch(`http://localhost:8080/api/items/${groupId}/suggestions`, {
      headers: getAuthHeader(),
    })
      .then((response) => {
        if (isAuthError(response)) return null;
        return response.json();
      })
      .then((data) => {
        if (data === null) return;
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
      <Link to="/" className="back-link">← Back to my lists</Link>
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