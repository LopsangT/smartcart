import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Groups.css';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    fetch('http://localhost:8080/api/groups', {
      headers: getAuthHeader(),
    })
      .then((response) => response.json())
      .then((data) => setGroups(data));
  };

  const createGroup = () => {
    if (newGroupName === '') return;
    fetch('http://localhost:8080/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ name: newGroupName }),
    })
      .then((response) => response.json())
      .then((newGroup) => {
        setGroups([...groups, newGroup]);
        setNewGroupName('');
      });
  };

  const joinGroup = () => {
    if (inviteCode === '') return;
    setError('');
    fetch('http://localhost:8080/api/groups/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ inviteCode }),
    })
      .then((response) => response.json().then((data) => ({ status: response.status, data })))
      .then(({ status, data }) => {
        if (status === 200) {
          setInviteCode('');
          fetchGroups();
        } else {
          setError(data.error);
        }
      });
  };

  const openGroup = (groupId) => {
    navigate(`/list/${groupId}`);
  };

  const startEditing = (group) => {
    setEditingId(group.id);
    setEditName(group.name);
    setEditEmoji(group.emoji || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditEmoji('');
  };

  const saveEdit = (groupId) => {
    fetch(`http://localhost:8080/api/groups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ name: editName, emoji: editEmoji }),
    })
      .then((response) => response.json())
      .then((updatedGroup) => {
        setGroups(
          groups.map((g) => (g.id === groupId ? updatedGroup : g))
        );
        cancelEditing();
      });
  };

  const deleteGroup = (groupId) => {
    fetch(`http://localhost:8080/api/groups/${groupId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    }).then(() => {
      setGroups(groups.filter((g) => g.id !== groupId));
    });
  };

  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="container">
      <h2>My Lists</h2>

      <div className="groups-actions">
        <div className="groups-action-row">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="e.g. Personal Groceries"
          />
          <button onClick={createGroup}>Create list</button>
        </div>

        <div className="groups-action-row">
          <input
            type="text"
            className="invite-code-input"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Code"
            maxLength={6}
          />
          <button onClick={joinGroup}>Join list</button>
        </div>
        {error && <p className="auth-error">{error}</p>}
      </div>

      <div className="groups-grid">
        {groups.map((group) => (
          <div key={group.id} className={`group-card ${group.members.length > 1 ? 'shared' : ''}`}>
            {editingId === group.id ? (
              <div className="group-card-edit">
                <input
                  type="text"
                  className="edit-emoji-input"
                  value={editEmoji}
                  onChange={(e) => setEditEmoji(e.target.value)}
                  placeholder="👤"
                  maxLength={2}
                />
                <input
                  type="text"
                  className="edit-name-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <div className="edit-actions">
                  <button onClick={() => saveEdit(group.id)}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="group-card-actions">
                  <button
                    className="card-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(group);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="card-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGroup(group.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>

                <div className="group-card-clickable" onClick={() => openGroup(group.id)}>
                  <div className="group-card-title">
                    {group.emoji || (group.members.length > 1 ? '👥' : '👤')} {group.name}
                  </div>
                  <p className="group-card-members">
                    {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="group-card-footer">
                  <span className="group-card-code">{group.inviteCode}</span>
                  <button
                    className="copy-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyInviteCode(group.inviteCode);
                    }}
                  >
                    📋
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;