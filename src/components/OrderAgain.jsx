import { RotateCcw } from 'lucide-react';

function OrderAgain({ orders, onReorder }) {
  if (!orders || orders.length === 0) return null;

  return (
    <section className="px-4 mt-8 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <RotateCcw className="w-4 h-4 text-sage-600" />
        <h2 className="text-lg font-semibold text-charcoal-900">Order Again</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 stagger-children">
        {orders.slice(0, 2).map((order, index) => (
          <button
            key={order.id}
            onClick={() => onReorder(order)}
            className="bg-white rounded-2xl p-4 text-left shadow-soft card-hover btn-press group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <img
                src={order.image}
                alt={order.name}
                className="w-12 h-12"
              />
              <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-premium">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>

            <h3 className="font-semibold text-charcoal-900 mt-3 text-sm">
              {order.name}
            </h3>
            <p className="text-charcoal-500 text-xs mt-1">
              {order.milk} · {order.size}
            </p>
            <p className="text-sage-600 font-semibold text-sm mt-2">
              ${order.price.toFixed(2)}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default OrderAgain;
