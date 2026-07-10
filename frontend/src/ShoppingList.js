import './styles/ShoppingList.css';

function ShoppingList({ items, onDelete, onClearAll, onUpdateQuantity, onUpdatePrice }) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <span className="item-name">{item.name}</span>
                <div className="price-section">
                  <span className="price-symbol">£</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="price-edit"
                    key={`${item.id}-${item.price}`}
                    defaultValue={Number(item.price).toFixed(2)}
                    onBlur={(e) => onUpdatePrice(item.id, e.target.value)}
                  />
                  <span className="subtotal">
                    = £{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(item.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="total-section">
            <span>Total:</span>
            <span className="total-amount">£{total.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingList;