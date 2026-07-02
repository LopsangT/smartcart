import './styles/ShoppingList.css';

function ShoppingList({ items, onDelete, onClearAll }) {
  return (
    <div className="shopping-list">
      {items.length === 0 ? (
        <p className="empty-list">No items yet — add something above!</p>
      ) : (
        <>
          <div className="list-header">
            <span>{items.length} items</span>
            <button className="clear-btn" onClick={onClearAll}>
              Clear All
            </button>
          </div>
          <ul>
            {items.map((item) => (
              <li className="shopping-list-item" key={item.id}>
                <span>{item.name}</span>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(item.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ShoppingList;