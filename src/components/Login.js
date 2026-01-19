import React, { useState } from 'react';
import { authService } from '../services/authService';

export function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authService.login(username, password, 'POS-01');

      localStorage.setItem('pos_token', data.token);
      // localStorage.setItem('session_id', data.session_id);

      onLogin(data.employee, data.token);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Đăng nhập thất bại'
      );
    }
  };

  return (
    <div className="app-login">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Đăng nhập hệ thống POS</h2>

        {error && <div className="error-message">{error}</div>}

        <div>
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} />
        </div>

        <div>
          <label>Password</label>
          <input type="password"
                 value={password}
                 onChange={e => setPassword(e.target.value)} />
        </div>

        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}
