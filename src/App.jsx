import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import OrderAgain from './components/OrderAgain';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { products, recentOrders } from './data/products';

function App() {
  const [activeCategory, setActiveCategory] = useState('espresso');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

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
    setIsCheckoutOpen(false);
    setCartItems([]);
    setOrderComplete(true);
    setTimeout(() => setOrderComplete(false), 3000);
  };

  // Lock body scroll when modals are open
  useEffect(() => {
    if (selectedProduct || isCartOpen || isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct, isCartOpen, isCheckoutOpen]);

  return (
    <div className="min-h-screen bg-cream-50">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
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
