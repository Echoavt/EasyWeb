import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (res.ok) {
      const data = await res.json();
      login({ email }, data.accessToken);
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
      <button>Register</button>
    </form>
  );
}
