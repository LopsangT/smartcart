import './styles/AISuggestions.css';

function AISuggestions({ suggestions, loading, onGetSuggestions, onAddSuggestion }) {
  return (
    <div className="ai-suggestions">
      <button
        className="suggest-btn"
        onClick={onGetSuggestions}
        disabled={loading}
      >
        {loading ? 'Thinking...' : '✨ Get AI Suggestions'}
      </button>

      {suggestions.length > 0 && (
        <div className="suggestion-chips">
          {suggestions.map((item, index) => (
            <button
              key={index}
              className="suggestion-chip"
              onClick={() => onAddSuggestion(item)}
            >
              + {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AISuggestions;