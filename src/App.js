import React, { useEffect, useState } from 'react';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { Header } from './components/Header';
import { PaymentModal } from './components/PaymentModal';
import { Login } from './components/Login';
import './index.css';

export default function App() {
  const [employee, setEmployee] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pos_token'));
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

 const mockProducts = [
  
      {
    id: 1,
    name: 'Coca Cola lon',
    price: 10000,
    stock: 20, 
    active: true,
    sku: '200003',
    category: { name: 'Nước giải khát' },
   image: '/images/tải xuống (1).jpg'
  },
  {
    id: 2,
    name: 'Pepsi lon',
    price: 10000,
    stock: 20,
    active: true,
    sku: '200002',
    category: { name: 'Nước giải khát' },
     image: '/images/pepsi.jpg'
  },
  {
    id: 3,
    name: 'Mì Hảo Hảo tôm chua cay',
    price: 4500,
    stock: 0, // ❌ hết hàng
    active: true,
    sku: '200001',
    category: { name: 'Thực phẩm' },
    image: '/images/tải xuống.jpg'
  },
  {
    id: 4,
    name: 'Snack Oishi chay da heo',
    price: 8000,
    stock: 12,
    active: false, // ❌ bị tắt
    sku: '300001',
    category: { name: 'Ăn vặt' },
    image: '/images/tải xuống (2).jpg'
  },
  {
    id: 5,
    name: 'Bánh ChocoPie CADBURY',
    price: 25000,
    stock: 8,
    active: true,
    sku: '300002',
    category: { name: 'Bánh kẹo' },
    image: '/images/tải xuống (3).jpg'
  },
  {
    id: 6,
    name: 'Nước suối Aquafina',
    price: 6000,
    stock: 30,
    active: true,
    sku: '100003',
    category: { name: 'Nước giải khát' },
    image: '/images/tải xuống 4).jpg'
  },
  {
    id: 7,
    name: 'Cà phê sữa Highlands',
    price: 22000,
    stock: 5,
    active: true,
    sku: '400001',
    category: { name: 'Đồ uống' },
   image: '/images/CA_PHE_SUA_185ml_v3.jpg'
  },
  {
    id: 8,
    name: 'Trà sữa đóng chai',
    price: 18000,
    stock: 0, // ❌ hết hàng
    active: true,
    sku: '100004',
    category: { name: 'Nước giải khát' },
    image: '/images/tải xuống (5).jpg'
  },
  {
    id: 9,
    name: 'Kẹo socola bơ đậu phộng',
    price: 5000,
    stock: 25,
    active: true,
    sku: '300003',
    category: { name: 'Bánh kẹo' },
    image: '/images/tải xuống (6).jpg'
  },
  {
    id: 10,
    name: 'Sữa tươi Vinamilk',
    price: 32000,
    stock: 10,
    active: true,
    sku: '500001',
    category: { name: 'Sữa' },
    image: '/images/images.jpg'
  }
];


  // ✅ LOAD MOCK SAU KHI LOGIN
  useEffect(() => {
    if (!token) return;
    setProducts(mockProducts);
  }, [token]);

  // ✅ LOGIN MOCK
  if (!employee) {
    return (
      <Login
        onLogin={(emp, tok) => {
          setEmployee(emp);
          setToken(tok);
          localStorage.setItem('pos_token', tok);
        }}
      />
    );
  }

  // ✅ CATEGORY
  const categories = [
    'all',
    ...Array.from(new Set(products.map(p => p.category?.name)))
  ];

  // ✅ CART LOGIC
  const addToCart = (product) => {
    if (product.stock <= 0 || !product.active) {
      alert('Sản phẩm không khả dụng!');
      return;
    }

    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = id => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setCart([]);

  // ✅ FILTER
  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q || p.name.toLowerCase().includes(q) || p.sku.includes(q);
    const matchCategory =
      selectedCategory === 'all' || p.category?.name === selectedCategory;
    return matchSearch && matchCategory;
  });

  // ✅ BARCODE MOCK
  const handleBarcodeSearch = (code) => {
    const product = products.find(p => p.sku === code);
    if (!product) return alert('Không tìm thấy sản phẩm!');
    addToCart(product);
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <div className="app-root">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onBarcodeSearch={handleBarcodeSearch}
        employee={employee}
      />

      <div className="app-body">
        <div className="left-col">
          <div className="category-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'btn-cat active' : 'btn-cat'}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>

          <ProductGrid
            products={filteredProducts}
            onProductClick={addToCart}
          />
        </div>

        <Cart
          items={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          subtotal={subtotal}
          tax={tax}
          total={total}
          onCheckout={() => setShowPaymentModal(true)}
        />
      </div>

      {showPaymentModal && (
        <PaymentModal
          total={total}
          items={cart}
          onClose={() => setShowPaymentModal(false)}
          onComplete={() => {
            clearCart();
            setShowPaymentModal(false);
          }}
        />
      )}
    </div>
  );
}
