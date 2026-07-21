import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

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

      <div className="form-group">
        <label>Create a new list</label>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="e.g. Personal Groceries"
        />
        <button className="auth-btn" onClick={createGroup}>Create</button>
      </div>

      <div className="form-group">
        <label>Join a list with an invite code</label>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="e.g. A3F9K2"
        />
        <button className="auth-btn" onClick={joinGroup}>Join</button>
        {error && <p className="auth-error">{error}</p>}
      </div>

      <h3>Your Lists</h3>
      <ul>
        {groups.map((group) => (
          <li key={group.id} onClick={() => openGroup(group.id)} style={{ cursor: 'pointer' }}>
            {group.name} — invite code: <strong>{group.inviteCode}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Groups;