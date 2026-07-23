import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Groups.css';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
          <div
            key={group.id}
            className={`group-card ${group.members.length > 1 ? 'shared' : ''}`}
            onClick={() => openGroup(group.id)}
          >
            <div className="group-card-title">
              {group.members.length > 1 ? '👥' : '👤'} {group.name}
            </div>
            <p className="group-card-members">
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </p>
            <div className="group-card-footer">
              <span className="group-card-code">{group.inviteCode}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;