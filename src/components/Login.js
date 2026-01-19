import React, { useState } from 'react';

export function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 👉 MOCK LOGIN (KHÔNG GỌI API)
    if (username === 'admin' && password === '222444') {
      const mockEmployee = {
        id: 1,
        full_name: 'Admin',
        username: 'admin'
      };

      const mockToken = 'mock-token-123';

      // lưu giả vào localStorage
      localStorage.setItem('pos_token', mockToken);
      localStorage.setItem('employee', JSON.stringify(mockEmployee));

      // gọi callback để vào hệ thống
      onLogin(mockEmployee, mockToken);
    } else {
      setError('Đăng nhập thất bại');
    }
  };

  return (
    <div className="app-login">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Đăng nhập hệ thống POS</h2>

        {error && <div className="error-message">{error}</div>}

        <div>
          <label>Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}
