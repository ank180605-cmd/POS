import React, { useState, useEffect } from 'react';
import { Search, Store, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

export function Header({
  searchTerm = '',
  onSearchChange = () => {},
  onBarcodeSearch = () => {},
  employee = null
}) {
  const [now, setNow] = useState(new Date());

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') onBarcodeSearch(searchTerm.trim());
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('pos_token');
    const sessionId = localStorage.getItem('work_session_id');
    if (!token || !sessionId) return;

    try {
      await authService.logout(token);
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem('pos_token');
    localStorage.removeItem('work_session_id');
    window.location.reload();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="top-row">
          <div className="brand">
            <Store />
            <div className="brand-sub">KA - Mart</div>
          </div>

          <div className="time-info">
            <div>
              <strong>Thu ngân:</strong>{' '}
              {employee ? employee.full_name : 'Chưa đăng nhập'}
            </div>
            <div>
              {now.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}{' '}
              - {now.toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
            </div>
            {employee && (
              <button className="btn-logout" onClick={handleLogout}>
                <LogOut size={16} /> Đăng xuất
              </button>
            )}
          </div>
        </div>

        <div className="search-area">
          <div className="search-box">
            <Search className="icon" />
            <input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tìm kiếm sản phẩm hoặc nhập mã sản phẩm..."
            />
          </div>
        </div>
      </div>
    </header>
  );
}
