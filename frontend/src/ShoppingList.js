import './styles/ShoppingList.css';

function ShoppingList({ items }) {
  return (
    <div className="shopping-list">
      {items.length === 0 ? (
        <p className="empty-list">No items yet — add something above!</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li className="shopping-list-item" key={index}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShoppingList;