import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [presets, setPresets] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/presets', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setPresets);
    fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setProjects);
  }, [token]);

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Presets</h3>
      <ul>{presets.map(p => <li key={p._id}>{p.name}</li>)}</ul>
      <h3>Projects</h3>
      <ul>{projects.map(p => <li key={p._id}>{p.name}</li>)}</ul>
    </div>
  );
}
