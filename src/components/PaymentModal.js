import React, { useState, useEffect } from 'react';
import { X, Banknote, CreditCard, UserPlus } from 'lucide-react';
import httpAxios from '../services/httpAxios';

export function PaymentModal({
  total = 0,
  items = [],
  source = 'pos',
  employeeId = null,
  onClose = () => { },
  onComplete = () => { }
}) {
  const [method, setMethod] = useState(null);
  const [cash, setCash] = useState("");
  const [loading, setLoading] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  const [orderId, setOrderId] = useState(null);

  const change = cash ? Number(cash) - total : 0;
  const canPay = method && (method !== "cash" || change >= 0);

  // LOAD CUSTOMERS
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await httpAxios.get("/customers");
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Load customers failed", e);
    }
  };

  // POLLING STATUS
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await httpAxios.get(`/orders/${orderId}/status`);
        if (res.data.status === "paid") {
          clearInterval(interval);
          alert("🎉 Thanh toán VNPay thành công!");
          onComplete();
          onClose();
        }
      } catch (e) {
        console.log("Status check error", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [orderId]);

  // CREATE CUSTOMER
  const createCustomer = async () => {
    if (!newCustomerName) return alert("Nhập tên khách!");

    try {
      const res = await httpAxios.post("/customers", {
        name: newCustomerName,
        phone: newCustomerPhone,
        points: 0
      });

      setSelectedCustomer(res.data);
      setCreatingCustomer(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      loadCustomers();
    } catch (e) {
      alert("Tạo khách thất bại!");
    }
  };

  // HANDLE PAYMENT
  const handlePay = async () => {
    if (!canPay || loading) return;

    setLoading(true);

    try {
      // Tạo ORDER
      const orderRes = await httpAxios.post("/orders", {
        customer_name: selectedCustomer?.name || "",
        customer_phone: selectedCustomer?.phone || "",
        items: items.map(i => ({
          product_id: i.id,
          quantity: i.quantity,
          price: i.price
        })),
        total,
        payment_method: method,
        source,
        employee_id: employeeId
      });

      const oid = orderRes.data.order_id;
      setOrderId(oid);

      // VNPay
      if (method === "vnpay") {
        const payRes = await httpAxios.post("/payment/vnpay/create", {
          amount: total,
          order_id: oid
        });

        window.open(payRes.data.payment_url, "_blank");
        alert("Vui lòng hoàn tất thanh toán VNPay!");
        return;
      }

      // CASH
      alert("Thanh toán tiền mặt thành công!");
      onComplete();
      onClose();

    } catch (e) {
      alert(e.response?.data?.message || "Lỗi thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm))
  );

  return (
    <div className="modal-backdrop">
      <div className="modal">

        <div className="modal-header">
          <h3>Thanh toán</h3>
          <button className="close" onClick={onClose}><X /></button>
        </div>

        <div className="modal-body">

          {/* ===================== KHÁCH HÀNG — GIỮ NGUYÊN ===================== */}
          <div className="customer-section">
            <label>Khách hàng</label>

            {!creatingCustomer ? (
              <>
                <input
                  placeholder="Tìm tên hoặc SĐT..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />

                <div className="customer-list">
                  {filteredCustomers.map(c => (
                    <div
                      key={c.id}
                      className={`customer-item ${selectedCustomer?.id === c.id ? "selected" : ""}`}
                      onClick={() => setSelectedCustomer(c)}
                    >
                      {c.name} ({c.phone})
                    </div>
                  ))}

                  <button className="btn-create-customer" onClick={() => setCreatingCustomer(true)}>
                    <UserPlus /> Khách mới
                  </button>
                </div>
                {selectedCustomer && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded">
                    <strong>Điểm tích lũy:</strong>{" "}
                    <span className="text-green-700 font-bold">
                      {selectedCustomer.points ?? 0} điểm
                    </span>
                  </div>
                )}

              </>
            ) : (
              <div className="create-customer-form">
                <input
                  placeholder="Tên khách"
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}

                />

                <input
                  placeholder="Số điện thoại"
                  value={newCustomerPhone}
                  onChange={e => setNewCustomerPhone(e.target.value)}
                />
                <button onClick={createCustomer}>Tạo</button>
                <button onClick={() => setCreatingCustomer(false)}>Hủy</button>
              </div>
            )}
          </div>

          {/* TOTAL */}
          <div className="total-box">
            <div>Tổng</div>
            <div className="big">{total.toLocaleString("vi-VN")}đ</div>
          </div>

          {/* METHODS */}
          <div className="methods">
            <button
              className={method === "cash" ? "active" : ""}
              onClick={() => setMethod("cash")}
            >
              <Banknote /> Tiền mặt
            </button>

            <button
              className={method === "vnpay" ? "active" : ""}
              onClick={() => setMethod("vnpay")}
            >
              <CreditCard /> VNPay
            </button>
          </div>

          {/* CASH INPUT */}
          {method === "cash" && (
            <div className="cash-input">
              <input
                type="number"
                value={cash}
                onChange={e => setCash(e.target.value)}
                placeholder="Tiền khách đưa"
              />
              <div className={`change ${change >= 0 ? "pos" : "neg"}`}>
                Thối: {change.toLocaleString("vi-VN")}đ
              </div>
            </div>
          )}

          {/* BUTTON */}
          <button
            className={`btn-confirm ${!canPay || loading ? "disabled" : ""}`}
            disabled={!canPay || loading}
            onClick={handlePay}
          >
            {loading ? "Đang xử lý..." : method === "vnpay" ? "Thanh toán VNPay" : "Xác nhận"}
          </button>

        </div>
      </div>
    </div>
  );
}
