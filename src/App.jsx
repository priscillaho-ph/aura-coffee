import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import OrderAgain from './components/OrderAgain';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import BeanJourney from './components/BeanJourney';
import { products, recentOrders } from './data/products';
import { badges, originToCountry } from './data/coffeeRegions';

// Helper to get data from localStorage
const getStoredData = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to save data to localStorage
const saveStoredData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage not available
  }
};

function App() {
  const [activeCategory, setActiveCategory] = useState('espresso');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Bean journey tracking
  const [triedOrigins, setTriedOrigins] = useState(() => getStoredData('aura_tried_origins', []));
  const [orderHistory, setOrderHistory] = useState(() => getStoredData('aura_order_history', []));

  const filteredProducts = products.filter(p => p.category === activeCategory);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.productId === item.productId &&
            i.milk === item.milk &&
            i.sweetener === item.sweetener &&
            i.size === item.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prev, { ...item, quantity: 1, cartId: Date.now() }];
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const addRecentOrder = (order) => {
    const cartItem = {
      productId: order.productId,
      name: order.name,
      image: order.image,
      milk: order.milk,
      size: order.size,
      sweetener: 'No Sweetener',
      totalPrice: order.price,
      quantity: 1,
      cartId: Date.now(),
    };
    setCartItems(prev => [...prev, cartItem]);
    setIsCartOpen(true);
  };

  const updateQuantity = (cartId, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.cartId === cartId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const completeOrder = () => {
    // Track origins from ordered items
    const newOrigins = cartItems
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        return product?.origin;
      })
      .filter(origin => origin && originToCountry[origin]);

    // Update tried origins
    const updatedOrigins = [...new Set([...triedOrigins, ...newOrigins])];
    setTriedOrigins(updatedOrigins);
    saveStoredData('aura_tried_origins', updatedOrigins);

    // Add to order history
    const newOrders = cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        id: Date.now() + Math.random(),
        productId: item.productId,
        name: item.name,
        category: product?.category,
        origin: product?.origin,
        timestamp: new Date().toISOString(),
      };
    });
    const updatedHistory = [...orderHistory, ...newOrders];
    setOrderHistory(updatedHistory);
    saveStoredData('aura_order_history', updatedHistory);

    setIsCheckoutOpen(false);
    setCartItems([]);
    setOrderComplete(true);
    setTimeout(() => setOrderComplete(false), 3000);
  };

  const resetProgress = () => {
    setTriedOrigins([]);
    setOrderHistory([]);
    localStorage.removeItem('aura_tried_origins');
    localStorage.removeItem('aura_order_history');
  };

  // Lock body scroll when modals are open
  useEffect(() => {
    if (selectedProduct || isCartOpen || isCheckoutOpen || isProfileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct, isCartOpen, isCheckoutOpen, isProfileOpen]);

  // Calculate earned badges for header indicator
  const triedCountries = [...new Set(
    triedOrigins.map(origin => originToCountry[origin]).filter(Boolean)
  )];
  const totalOrders = orderHistory.length;
  const categoryCounts = orderHistory.reduce((acc, order) => {
    acc[order.category] = (acc[order.category] || 0) + 1;
    return acc;
  }, {});
  const availableOrigins = Object.keys(originToCountry).filter(o => originToCountry[o]).length;

  const earnedBadgeCount = badges.filter(badge => {
    const req = badge.requirement;
    switch (req.type) {
      case 'orders': return totalOrders >= req.count;
      case 'countries': return triedCountries.length >= req.count;
      case 'specific-countries': return req.countries.every(c => triedCountries.includes(c));
      case 'all-origins': return triedOrigins.length >= availableOrigins;
      case 'category': return (categoryCounts[req.category] || 0) >= req.count;
      case 'time': return orderHistory.some(order => {
        const hour = new Date(order.timestamp).getHours();
        if (req.before) return hour < req.before;
        if (req.after) return hour >= req.after;
        return false;
      });
      default: return false;
    }
  }).length;

  return (
    <div className="min-h-screen bg-cream-50">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        badgeCount={earnedBadgeCount}
      />

      <main className="pb-24">
        <HeroSection />

        <OrderAgain
          orders={recentOrders}
          onReorder={addRecentOrder}
        />

        <section className="mt-8">
          <CategoryNav
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <ProductGrid
            products={filteredProducts}
            onProductClick={setSelectedProduct}
          />
        </section>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Cart Slide-out */}
      {isCartOpen && (
        <Cart
          items={cartItems}
          total={cartTotal}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={handleCheckout}
        />
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <Checkout
          items={cartItems}
          total={cartTotal}
          onClose={() => setIsCheckoutOpen(false)}
          onComplete={completeOrder}
        />
      )}

      {/* Bean Journey / Profile Modal */}
      {isProfileOpen && (
        <BeanJourney
          onClose={() => setIsProfileOpen(false)}
          triedOrigins={triedOrigins}
          orderHistory={orderHistory}
          onReset={resetProgress}
        />
      )}

      {/* Order Complete Toast */}
      {orderComplete && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-charcoal-900 text-white px-6 py-4 rounded-2xl shadow-soft-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">Order placed successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
