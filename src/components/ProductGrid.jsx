import { Star } from 'lucide-react';

// Monochromatic sage palette with subtle variations
const noteColors = {
  'Smooth': 'bg-sage-100 text-sage-700',
  'Creamy': 'bg-sage-100 text-sage-600',
  'Bold': 'bg-sage-200 text-sage-800',
  'Velvety': 'bg-sage-100 text-sage-600',
  'Intense': 'bg-sage-200 text-sage-800',
  'Rich': 'bg-sage-200 text-sage-700',
  'Clean': 'bg-sage-50 text-sage-600',
  'Chocolatey': 'bg-sage-200 text-sage-700',
  'Low Acidity': 'bg-sage-50 text-sage-600',
  'Refreshing': 'bg-sage-50 text-sage-600',
  'Effervescent': 'bg-sage-100 text-sage-600',
  'Citrus': 'bg-sage-100 text-sage-700',
  'Sweet': 'bg-sage-100 text-sage-600',
  'Aromatic': 'bg-sage-100 text-sage-700',
  'Floral': 'bg-sage-50 text-sage-600',
  'Delicate': 'bg-sage-50 text-sage-500',
  'Earthy': 'bg-sage-200 text-sage-700',
  'Umami': 'bg-sage-200 text-sage-800',
  'Spiced': 'bg-sage-200 text-sage-700',
  'Warming': 'bg-sage-100 text-sage-700',
  'Buttery': 'bg-sage-100 text-sage-600',
  'Nutty': 'bg-sage-100 text-sage-700',
  'Savory': 'bg-sage-200 text-sage-700',
  'Fresh': 'bg-sage-50 text-sage-600',
  'Light': 'bg-sage-50 text-sage-500',
  'Fruity': 'bg-sage-100 text-sage-600',
  'Salty-Sweet': 'bg-sage-200 text-sage-700',
};

function ProductGrid({ products, onProductClick }) {
  return (
    <div className="px-4 mt-6 max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-3 stagger-children">
        {products.map((product, index) => (
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            className="bg-white rounded-2xl p-4 text-left shadow-soft card-hover btn-press relative overflow-hidden group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Popular badge */}
            {product.popular && (
              <div className="absolute top-3 right-3 bg-sage-500/10 text-sage-600 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-sage-500" />
                Popular
              </div>
            )}

            {/* Product image */}
            <div className="mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 img-hover"
              />
            </div>

            {/* Product info */}
            <h3 className="font-semibold text-charcoal-900 text-sm leading-tight">
              {product.name}
            </h3>

            {/* Origin - subtle text for connoisseurs */}
            {product.origin && (
              <p className="text-charcoal-400 text-[10px] mt-0.5 uppercase tracking-wide">
                {product.origin}
              </p>
            )}

            {/* Tasting notes badges */}
            {product.notes && product.notes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {product.notes.slice(0, 2).map((note) => (
                  <span
                    key={note}
                    className={`text-[10px] px-2 py-0.5 rounded-full ${noteColors[note] || 'bg-cream-100 text-charcoal-500'}`}
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-sage-600 font-semibold">
                ${product.price.toFixed(2)}
              </span>
              <div className="w-7 h-7 bg-charcoal-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-premium">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
