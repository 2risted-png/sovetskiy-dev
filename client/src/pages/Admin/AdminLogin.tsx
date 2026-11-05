import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error('Неверный логин или пароль');

      const data = await res.json();
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <form className="glass-card admin-login-form" onSubmit={handleLogin}>
        <h2>Вход в панель</h2>
        {error && <div style={{ color: '#f87171', marginBottom: '16px' }}>{error}</div>}
        
        <input 
          type="text" 
          placeholder="Логин (admin)" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" className="liquid-btn primary">Войти</button>
        <button type="button" onClick={() => navigate('/')} className="admin-back-link">← На сайт</button>
      </form>
    </div>
  );
}