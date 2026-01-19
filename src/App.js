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
    price: 12000,
    stock: 20,
    active: true,
    sku: '100001',
    category: { name: 'Nước giải khát' },
    image: 'data:image/jpeg;base64,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'
  },
  {
    id: 2,
    name: 'Pepsi lon',
    price: 12000,
    stock: 15,
    active: true,
    sku: '100002',
    category: { name: 'Nước giải khát' },
    image: 'data:image/jpeg;base64,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'
  },
  {
    id: 3,
    name: 'Mì Hảo Hảo tôm chua cay',
    price: 4500,
    stock: 0, // ❌ hết hàng
    active: true,
    sku: '200001',
    category: { name: 'Thực phẩm' },
    image: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2565/85959/bhx/slide-1_202410151356065341.jpg'
  },
  {
    id: 4,
    name: 'Snack Oishi chay da heo',
    price: 8000,
    stock: 12,
    active: false, // ❌ bị tắt
    sku: '300001',
    category: { name: 'Ăn vặt' },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPz86PYob9Wp2hKE86Q2qKTRORNBTgWZvLY_dtq4YSsw&s'
  },
  {
    id: 5,
    name: 'Bánh ChocoPie CADBURY',
    price: 25000,
    stock: 8,
    active: true,
    sku: '300002',
    category: { name: 'Bánh kẹo' },
    image: 'https://product.hstatic.net/200000078749/product/515901_banh_chocopie_cadbury_hop_180g_9da810bbdd2a49ef860ad48154853cd5_0c0ff2df07dd4bd0a708bfbc1f4f9afd.png'
  },
  {
    id: 6,
    name: 'Nước suối Aquafina',
    price: 6000,
    stock: 30,
    active: true,
    sku: '100003',
    category: { name: 'Nước giải khát' },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNau8gJN41j_wj8DTFAUujt2xl5qF5TdK4yA&s'
  },
  {
    id: 7,
    name: 'Cà phê sữa Highlands',
    price: 22000,
    stock: 5,
    active: true,
    sku: '400001',
    category: { name: 'Đồ uống' },
    image: 'https://cdn.upharma.vn/unsafe/3840x0/filters:quality(90)/san-pham/21589.png'
  },
  {
    id: 8,
    name: 'Trà sữa đóng chai',
    price: 18000,
    stock: 0, // ❌ hết hàng
    active: true,
    sku: '100004',
    category: { name: 'Nước giải khát' },
    image: 'https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/P06469_1.jpg'
  },
  {
    id: 9,
    name: 'Kẹo socola bơ đậu phộng',
    price: 5000,
    stock: 25,
    active: true,
    sku: '300003',
    category: { name: 'Bánh kẹo' },
    image: 'https://lanchi.vn/wp-content/uploads/2021/12/KEO-SOCOLA-NHAN-BO-DAU-PHONG-SNICKERS-THANH-51G.jpg'
  },
  {
    id: 10,
    name: 'Sữa tươi Vinamilk',
    price: 32000,
    stock: 10,
    active: true,
    sku: '500001',
    category: { name: 'Sữa' },
    image: 'https://suatuoiuc.vn/wp-content/uploads/2024/01/sua-tiet-trung-vinamilk-khong-duong-hop-180ml-11.webp'
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
