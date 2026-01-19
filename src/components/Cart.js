// src/components/Cart.jsx
import React from 'react';
import { Trash2, Plus, Minus, ShoppingCart, X } from 'lucide-react';

export function Cart({
  items = [],
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onClearCart = () => {},
  subtotal = 0,
  tax = 0,
  total = 0,
  onCheckout = () => {}
}) {
  const qtyTotal = (items || []).reduce((s, it) => s + (it.quantity || 0), 0);

  return (
    <div className="cart-panel">
      <div className="cart-header">
        <div className="left">
          <ShoppingCart /> <h3>Giỏ hàng</h3>
          <span className="badge">{qtyTotal}</span>
        </div>

        <div>
          {items.length > 0 && (
            <button className="btn-clear" onClick={onClearCart}>
              <X /> Xóa tất cả
            </button>
          )}
        </div>
      </div>

      <div className="cart-body">
        {items.length === 0 ? (
          <div className="empty">
            <ShoppingCart className="big" />
            <p>Giỏ hàng trống</p>
            <p className="muted">Chọn sản phẩm để thêm vào giỏ</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="ci-left">
                <div className="ci-name">{item.name}</div>
                <div className="ci-price">{(item.price || 0).toLocaleString('vi-VN')}đ</div>
              </div>

              <div className="ci-right">
                <div className="qty-control">
                  <button onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}><Minus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}><Plus /></button>
                </div>

                <div className="ci-subtotal">
                  <div>{((item.price || 0) * (item.quantity || 0)).toLocaleString('vi-VN')}đ</div>
                  <button className="btn-remove" onClick={() => onRemoveItem(item.id)} title="Xóa">
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer">
        <div className="line"><span>Tạm tính:</span><span>{subtotal.toLocaleString('vi-VN')}đ</span></div>
        <div className="line"><span>VAT (10%):</span><span>{tax.toLocaleString('vi-VN')}đ</span></div>
        <div className="line total"><span>Tổng cộng:</span><span>{total.toLocaleString('vi-VN')}đ</span></div>

        <button className={`btn-checkout ${items.length === 0 ? 'disabled' : ''}`} onClick={onCheckout} disabled={items.length === 0}>
          Thanh toán
        </button>
      </div>
    </div>
  );
}
