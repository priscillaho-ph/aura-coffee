import { useState, useEffect } from 'react';
import { X, MapPin, Clock, CreditCard, CheckCircle2, ChevronDown, ChevronUp, Zap, Smartphone } from 'lucide-react';

// Storage keys
const STORAGE_KEYS = {
  pickupTime: 'aura_checkout_pickup_time',
  paymentMethod: 'aura_checkout_payment_method',
  lastOrder: 'aura_last_order',
};

// Helper to get saved preferences
const getSavedPreference = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved || defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to save preference
const savePreference = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage not available
  }
};

// Helper to get last order
const getLastOrder = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.lastOrder);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Helper to save last order
const saveLastOrder = (items, pickupTime, paymentMethod) => {
  try {
    localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify({
      items: items.map(i => ({ productId: i.productId, name: i.name, milk: i.milk, size: i.size, sweetener: i.sweetener })),
      pickupTime,
      paymentMethod,
      timestamp: Date.now(),
    }));
  } catch {
    // localStorage not available
  }
};

// Check if current order matches last order
const isRepeatOrder = (currentItems, lastOrder) => {
  if (!lastOrder || !lastOrder.items) return false;
  if (currentItems.length !== lastOrder.items.length) return false;

  return currentItems.every(current =>
    lastOrder.items.some(last =>
      last.productId === current.productId &&
      last.milk === current.milk &&
      last.size === current.size &&
      last.sweetener === current.sweetener
    )
  );
};

function Checkout({ items, total, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [pickupTime, setPickupTime] = useState(() => getSavedPreference(STORAGE_KEYS.pickupTime, 'asap'));
  const [paymentMethod, setPaymentMethod] = useState(() => getSavedPreference(STORAGE_KEYS.paymentMethod, 'apple'));
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [expressCheckout, setExpressCheckout] = useState(false);
  const [showExpressPrompt, setShowExpressPrompt] = useState(false);

  const totalWithTax = total * 1.08;
  const lastOrder = getLastOrder();
  const isRepeat = isRepeatOrder(items, lastOrder);

  // Show express checkout prompt for repeat orders
  useEffect(() => {
    if (isRepeat && lastOrder) {
      setShowExpressPrompt(true);
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    savePreference(STORAGE_KEYS.pickupTime, pickupTime);
  }, [pickupTime]);

  useEffect(() => {
    savePreference(STORAGE_KEYS.paymentMethod, paymentMethod);
  }, [paymentMethod]);

  const timeOptions = [
    { id: 'asap', label: 'ASAP', subtitle: '~5 min', highlight: true },
    { id: '15min', label: '15 min', subtitle: 'Standard' },
    { id: '30min', label: '30 min', subtitle: 'Later' },
  ];

  const paymentOptions = [
    { id: 'apple', label: 'Apple Pay', icon: Smartphone, express: true },
    { id: 'google', label: 'Google Pay', icon: Smartphone, express: true },
    { id: 'card1', label: 'Visa ****4242', icon: CreditCard },
  ];

  const handleComplete = () => {
    // Save this order for future express checkout
    saveLastOrder(items, pickupTime, paymentMethod);

    setStep(2);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleExpressCheckout = () => {
    // Use last order's preferences
    if (lastOrder) {
      setPickupTime(lastOrder.pickupTime);
      setPaymentMethod(lastOrder.paymentMethod);
    }
    setExpressCheckout(true);
    setShowExpressPrompt(false);

    // Auto-complete after brief confirmation
    setTimeout(() => {
      handleComplete();
    }, 800);
  };

  const handleDeclineExpress = () => {
    setShowExpressPrompt(false);
  };

  // Express prompt for repeat orders
  if (showExpressPrompt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-charcoal-900/40 animate-backdrop"
          onClick={handleDeclineExpress}
        />

        {/* Express Prompt Card */}
        <div className="relative bg-cream-50 w-full max-w-sm rounded-3xl overflow-hidden animate-scale-in shadow-soft-lg">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-sage-600" />
            </div>
            <h2 className="font-display text-xl text-charcoal-900">Same as last time?</h2>
            <p className="text-charcoal-500 text-sm mt-2">
              We noticed this looks like your usual order. Skip the details?
            </p>

            {/* Quick summary */}
            <div className="bg-white rounded-xl p-3 mt-4 text-left">
              <div className="text-xs text-charcoal-400 uppercase tracking-wide mb-1">Your order</div>
              <div className="text-sm text-charcoal-700">
                {items.slice(0, 2).map(item => item.name).join(', ')}
                {items.length > 2 && ` +${items.length - 2} more`}
              </div>
              <div className="text-sm font-semibold text-charcoal-900 mt-1">
                ${totalWithTax.toFixed(2)}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleExpressCheckout}
                className="w-full bg-sage-600 text-white py-4 rounded-2xl font-semibold text-base shadow-soft transition-premium hover:bg-sage-700 btn-press flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Express Order
              </button>
              <button
                onClick={handleDeclineExpress}
                className="w-full bg-white text-charcoal-700 py-3 rounded-2xl font-medium text-sm transition-premium hover:bg-cream-100 btn-press"
              >
                Customize This Order
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Express checkout processing state
  if (expressCheckout && step === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-charcoal-900/40 animate-backdrop" />
        <div className="relative bg-cream-50 w-full max-w-sm rounded-3xl p-8 text-center animate-scale-in">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="w-8 h-8 text-sage-600" />
          </div>
          <h2 className="font-display text-xl text-charcoal-900">Processing...</h2>
          <p className="text-charcoal-500 text-sm mt-2">Placing your order</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/40 animate-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-cream-50 w-full max-w-lg rounded-t-3xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-soft transition-premium hover:bg-cream-100 btn-press"
        >
          <X className="w-5 h-5 text-charcoal-600" />
        </button>

        {step === 1 ? (
          <>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto pb-28">
              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <h2 className="font-display text-2xl text-charcoal-900">Checkout</h2>
                <p className="text-charcoal-500 text-sm mt-1">Complete your order</p>
              </div>

              <div className="px-6 py-4 space-y-5">
                {/* Combined Pickup Section */}
                <div className="bg-white rounded-xl p-4 shadow-soft">
                  <div className="flex items-center gap-3 pb-3 border-b border-charcoal-100">
                    <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-sage-600" />
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900 text-sm">Aura Coffee - Downtown</p>
                      <p className="text-charcoal-400 text-xs">123 Main Street</p>
                    </div>
                  </div>

                  {/* Pickup Time - inline */}
                  <div className="pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3.5 h-3.5 text-sage-600" />
                      <span className="text-xs font-medium text-charcoal-500 uppercase tracking-wide">Pickup Time</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {timeOptions.map((time) => (
                        <button
                          key={time.id}
                          onClick={() => setPickupTime(time.id)}
                          className={`
                            py-2.5 px-3 rounded-xl text-center transition-premium btn-press relative
                            ${pickupTime === time.id
                              ? 'bg-charcoal-900 text-white shadow-soft'
                              : 'bg-cream-50 text-charcoal-700 hover:bg-cream-100'
                            }
                          `}
                        >
                          {time.highlight && pickupTime !== time.id && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-sage-500 rounded-full" />
                          )}
                          <div className="font-medium text-sm">{time.label}</div>
                          <div className={`text-[10px] mt-0.5 ${pickupTime === time.id ? 'text-charcoal-300' : 'text-charcoal-400'}`}>
                            {time.subtitle}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Express Payment Options */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-sage-600" />
                    <h3 className="text-sm font-semibold text-charcoal-900">Payment</h3>
                  </div>

                  {/* Express pay buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {paymentOptions.filter(p => p.express).map((payment) => {
                      const Icon = payment.icon;
                      return (
                        <button
                          key={payment.id}
                          onClick={() => setPaymentMethod(payment.id)}
                          className={`
                            py-3 px-4 rounded-xl text-center transition-premium btn-press flex items-center justify-center gap-2
                            ${paymentMethod === payment.id
                              ? 'bg-charcoal-900 text-white shadow-soft'
                              : 'bg-white text-charcoal-700 hover:bg-cream-100'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium text-sm">{payment.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Card option */}
                  {paymentOptions.filter(p => !p.express).map((payment) => {
                    const Icon = payment.icon;
                    return (
                      <button
                        key={payment.id}
                        onClick={() => setPaymentMethod(payment.id)}
                        className={`
                          w-full py-3 px-4 rounded-xl text-left transition-premium btn-press flex items-center gap-3
                          ${paymentMethod === payment.id
                            ? 'bg-charcoal-900 text-white shadow-soft'
                            : 'bg-white text-charcoal-700 hover:bg-cream-100'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{payment.label}</span>
                        {paymentMethod === payment.id && (
                          <CheckCircle2 className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Collapsible Order Summary */}
                <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                  <button
                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                    className="w-full px-4 py-3 flex items-center justify-between btn-press"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-charcoal-900">Order Summary</h3>
                      <span className="text-xs text-charcoal-400">
                        {items.length} item{items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-charcoal-900">${totalWithTax.toFixed(2)}</span>
                      {showOrderSummary ? (
                        <ChevronUp className="w-4 h-4 text-charcoal-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-charcoal-400" />
                      )}
                    </div>
                  </button>

                  {showOrderSummary && (
                    <div className="px-4 pb-4 pt-0 border-t border-charcoal-100">
                      <div className="space-y-2 text-sm pt-3">
                        {items.map((item) => (
                          <div key={item.cartId} className="flex justify-between">
                            <span className="text-charcoal-600">
                              {item.quantity}x {item.name}
                              {item.size && <span className="text-charcoal-400 text-xs ml-1">({item.size})</span>}
                            </span>
                            <span className="text-charcoal-900">
                              ${(item.totalPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-charcoal-100 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-charcoal-500">Subtotal</span>
                            <span className="text-charcoal-900">${total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-charcoal-500">Tax</span>
                            <span className="text-charcoal-900">${(total * 0.08).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Place Order Button */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-cream-50 via-cream-50 to-transparent">
              <button
                onClick={handleComplete}
                className="w-full bg-sage-600 text-white py-4 rounded-2xl font-semibold text-base shadow-soft-lg transition-premium hover:bg-sage-700 btn-press flex items-center justify-center gap-3"
              >
                {paymentMethod === 'apple' || paymentMethod === 'google' ? (
                  <>
                    <Smartphone className="w-5 h-5" />
                    <span>Pay with {paymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'}</span>
                  </>
                ) : (
                  <span>Place Order</span>
                )}
                <span className="bg-white/20 px-3 py-1 rounded-lg">
                  ${totalWithTax.toFixed(2)}
                </span>
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="px-6 py-16 text-center">
            <div className="w-20 h-20 bg-sage-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display text-2xl text-charcoal-900 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Order Confirmed!
            </h2>
            <p className="text-charcoal-500 mt-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              Ready for pickup in {pickupTime === 'asap' ? '~5 minutes' : pickupTime}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
