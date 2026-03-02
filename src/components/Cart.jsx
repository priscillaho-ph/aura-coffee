import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

function Cart({ items, total, onClose, onUpdateQuantity, onRemoveItem, onCheckout }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/40 animate-backdrop"
        onClick={onClose}
      />

      {/* Cart panel */}
      <div className="relative w-full max-w-md bg-cream-50 h-full animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-charcoal-900 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-charcoal-900">Your Cart</h2>
              <p className="text-sm text-charcoal-500">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-cream-100 rounded-full flex items-center justify-center transition-premium hover:bg-cream-200 btn-press"
          >
            <X className="w-5 h-5 text-charcoal-600" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-charcoal-300" />
              </div>
              <p className="text-charcoal-500 font-medium">Your cart is empty</p>
              <p className="text-charcoal-400 text-sm mt-1">Add some delicious items!</p>
            </div>
          ) : (
            <div className="space-y-4 stagger-children">
              {items.map((item, index) => (
                <div
                  key={item.cartId}
                  className="bg-white rounded-2xl p-4 shadow-soft"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-4">
                    {/* Item image */}
                    <div className="w-16 h-16 bg-cream-100 rounded-xl flex items-center justify-center shrink-0 p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Item details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-charcoal-900 text-sm">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(item.cartId)}
                          className="text-charcoal-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.size && (
                        <p className="text-charcoal-400 text-xs mt-1">
                          {item.size}
                          {item.milk && ` · ${item.milk}`}
                          {item.sweetener && item.sweetener !== 'No Sweetener' && ` · ${item.sweetener}`}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <span className="font-semibold text-sage-600">
                          ${(item.totalPrice * item.quantity).toFixed(2)}
                        </span>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.cartId, -1)}
                            className="w-7 h-7 bg-cream-100 rounded-full flex items-center justify-center transition-premium hover:bg-cream-200 btn-press"
                          >
                            <Minus className="w-3 h-3 text-charcoal-600" />
                          </button>
                          <span className="text-sm font-semibold text-charcoal-900 w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartId, 1)}
                            className="w-7 h-7 bg-cream-100 rounded-full flex items-center justify-center transition-premium hover:bg-cream-200 btn-press"
                          >
                            <Plus className="w-3 h-3 text-charcoal-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-charcoal-100 px-6 py-4 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-charcoal-500">Subtotal</span>
              <span className="font-medium text-charcoal-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-charcoal-500">Tax</span>
              <span className="font-medium text-charcoal-900">${(total * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-4 pt-2 border-t border-charcoal-100">
              <span className="font-semibold text-charcoal-900">Total</span>
              <span className="font-semibold text-charcoal-900 text-lg">
                ${(total * 1.08).toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={onCheckout}
              className="w-full bg-charcoal-900 text-white py-4 rounded-2xl font-semibold transition-premium hover:bg-charcoal-800 btn-press"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
