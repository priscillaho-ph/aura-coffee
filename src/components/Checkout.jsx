import { useState } from 'react';
import { X, MapPin, Clock, CreditCard, CheckCircle2 } from 'lucide-react';

function Checkout({ items, total, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [pickupTime, setPickupTime] = useState('15min');
  const [paymentMethod, setPaymentMethod] = useState('card1');

  const totalWithTax = total * 1.08;

  const timeOptions = [
    { id: '15min', label: '15 min', subtitle: 'Fastest' },
    { id: '30min', label: '30 min', subtitle: 'Standard' },
    { id: '1hour', label: '1 hour', subtitle: 'Later' },
  ];

  const paymentOptions = [
    { id: 'card1', label: 'Visa ****4242', icon: CreditCard },
    { id: 'apple', label: 'Apple Pay', icon: CreditCard },
  ];

  const handleComplete = () => {
    setStep(2);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/40 animate-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-cream-50 w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-soft transition-premium hover:bg-cream-100 btn-press"
        >
          <X className="w-5 h-5 text-charcoal-600" />
        </button>

        {step === 1 ? (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <h2 className="font-display text-2xl text-charcoal-900">Checkout</h2>
              <p className="text-charcoal-500 text-sm mt-1">Complete your order</p>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Pickup Location */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-sage-600" />
                  <h3 className="text-sm font-semibold text-charcoal-900">Pickup Location</h3>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-soft">
                  <p className="font-medium text-charcoal-900">Aura Coffee - Downtown</p>
                  <p className="text-charcoal-500 text-sm mt-1">123 Main Street, Suite 100</p>
                </div>
              </div>

              {/* Pickup Time */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-sage-600" />
                  <h3 className="text-sm font-semibold text-charcoal-900">Pickup Time</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {timeOptions.map((time) => (
                    <button
                      key={time.id}
                      onClick={() => setPickupTime(time.id)}
                      className={`
                        py-3 px-4 rounded-xl text-center transition-premium btn-press
                        ${pickupTime === time.id
                          ? 'bg-charcoal-900 text-white shadow-soft'
                          : 'bg-white text-charcoal-700 hover:bg-cream-100'
                        }
                      `}
                    >
                      <div className="font-medium text-sm">{time.label}</div>
                      <div className={`text-xs mt-0.5 ${pickupTime === time.id ? 'text-charcoal-300' : 'text-charcoal-400'}`}>
                        {time.subtitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-sage-600" />
                  <h3 className="text-sm font-semibold text-charcoal-900">Payment Method</h3>
                </div>
                <div className="space-y-2">
                  {paymentOptions.map((payment) => {
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
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl p-4 shadow-soft">
                <h3 className="text-sm font-semibold text-charcoal-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.cartId} className="flex justify-between">
                      <span className="text-charcoal-600">
                        {item.quantity}x {item.name}
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
                  <div className="border-t border-charcoal-100 pt-2 mt-2 flex justify-between font-semibold">
                    <span className="text-charcoal-900">Total</span>
                    <span className="text-charcoal-900">${totalWithTax.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="px-6 pb-8 pt-4">
              <button
                onClick={handleComplete}
                className="w-full bg-sage-600 text-white py-4 rounded-2xl font-semibold text-base shadow-soft-lg transition-premium hover:bg-sage-700 btn-press flex items-center justify-center gap-3"
              >
                <span>Place Order</span>
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
              Your order will be ready for pickup soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
