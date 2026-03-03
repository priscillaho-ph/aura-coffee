import { useState } from 'react';
import { X, Minus, Plus, MapPin } from 'lucide-react';
import { milkOptions, sweetenerOptions, sizeOptions } from '../data/products';
import { origins } from '../data/origins';
import OriginModal from './OriginModal';

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

function ProductDetail({ product, onClose, onAddToCart }) {
  const [selectedMilk, setSelectedMilk] = useState(milkOptions[0]);
  const [selectedSweetener, setSelectedSweetener] = useState(sweetenerOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[1]); // Default to medium
  const [quantity, setQuantity] = useState(1);
  const [showOrigin, setShowOrigin] = useState(false);

  const isFood = product.category === 'food';
  const originData = product.origin ? origins[product.origin] : null;

  const totalPrice =
    (product.price + selectedMilk.price + selectedSweetener.price + selectedSize.price) * quantity;

  const handleAddToCart = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      milk: isFood ? null : selectedMilk.name,
      sweetener: isFood ? null : selectedSweetener.name,
      size: isFood ? null : selectedSize.name,
      totalPrice: totalPrice / quantity,
    });
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

        {/* Header */}
        <div className="bg-gradient-to-br from-cream-100 to-sage-50 pt-12 pb-8 px-6 text-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-28 h-28 mx-auto mb-4"
          />
          <h2 className="font-display text-2xl text-charcoal-900">{product.name}</h2>

          {/* Origin badge - clickable */}
          {product.origin && originData && (
            <button
              onClick={() => setShowOrigin(true)}
              className="inline-flex items-center gap-1.5 mt-2 text-charcoal-500 text-xs hover:text-sage-600 transition-colors btn-press group"
            >
              <MapPin className="w-3 h-3 group-hover:text-sage-600" />
              <span className="uppercase tracking-wide underline decoration-dotted underline-offset-2">
                {product.origin}
              </span>
            </button>
          )}

          {/* Origin badge - non-clickable fallback */}
          {product.origin && !originData && (
            <div className="inline-flex items-center gap-1.5 mt-2 text-charcoal-500 text-xs">
              <MapPin className="w-3 h-3" />
              <span className="uppercase tracking-wide">{product.origin}</span>
            </div>
          )}

          <p className="text-charcoal-500 mt-3 text-sm max-w-xs mx-auto">
            {product.description}
          </p>

          {/* Tasting notes */}
          {product.notes && product.notes.length > 0 && (
            <div className="flex justify-center gap-2 mt-4">
              {product.notes.map((note) => (
                <span
                  key={note}
                  className={`text-xs px-3 py-1 rounded-full ${noteColors[note] || 'bg-cream-100 text-charcoal-600'}`}
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Story section - for connoisseurs */}
        {product.story && (
          <div className="px-6 py-4 border-b border-charcoal-100/50">
            <p className="text-charcoal-500 text-sm italic text-center">
              "{product.story}"
            </p>
          </div>
        )}

        {/* Configuration */}
        <div className="px-6 py-6 space-y-6">
          {/* Size selection - only for drinks */}
          {!isFood && (
            <div>
              <h3 className="text-sm font-semibold text-charcoal-900 mb-3">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      py-3 px-4 rounded-xl text-center transition-premium btn-press
                      ${selectedSize.id === size.id
                        ? 'bg-charcoal-900 text-white shadow-soft'
                        : 'bg-white text-charcoal-700 hover:bg-cream-100'
                      }
                    `}
                  >
                    <div className="font-medium text-sm">{size.name}</div>
                    <div className={`text-xs mt-0.5 ${selectedSize.id === size.id ? 'text-charcoal-300' : 'text-charcoal-400'}`}>
                      {size.subtitle}
                      {size.price > 0 && ` (+$${size.price.toFixed(2)})`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Milk selection - only for drinks */}
          {!isFood && (
            <div>
              <h3 className="text-sm font-semibold text-charcoal-900 mb-3">Milk</h3>
              <div className="flex flex-wrap gap-2">
                {milkOptions.map((milk) => (
                  <button
                    key={milk.id}
                    onClick={() => setSelectedMilk(milk)}
                    className={`
                      py-2 px-4 rounded-full text-sm transition-premium btn-press
                      ${selectedMilk.id === milk.id
                        ? 'bg-charcoal-900 text-white shadow-soft'
                        : 'bg-white text-charcoal-700 hover:bg-cream-100'
                      }
                    `}
                  >
                    {milk.name}
                    {milk.price > 0 && (
                      <span className={`ml-1 ${selectedMilk.id === milk.id ? 'text-charcoal-300' : 'text-charcoal-400'}`}>
                        +${milk.price.toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sweetener selection - only for drinks */}
          {!isFood && (
            <div>
              <h3 className="text-sm font-semibold text-charcoal-900 mb-3">Sweetener</h3>
              <div className="flex flex-wrap gap-2">
                {sweetenerOptions.map((sweetener) => (
                  <button
                    key={sweetener.id}
                    onClick={() => setSelectedSweetener(sweetener)}
                    className={`
                      py-2 px-4 rounded-full text-sm transition-premium btn-press
                      ${selectedSweetener.id === sweetener.id
                        ? 'bg-charcoal-900 text-white shadow-soft'
                        : 'bg-white text-charcoal-700 hover:bg-cream-100'
                      }
                    `}
                  >
                    {sweetener.name}
                    {sweetener.price > 0 && (
                      <span className={`ml-1 ${selectedSweetener.id === sweetener.id ? 'text-charcoal-300' : 'text-charcoal-400'}`}>
                        +${sweetener.price.toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal-900 mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-soft transition-premium hover:bg-cream-100 btn-press"
              >
                <Minus className="w-4 h-4 text-charcoal-600" />
              </button>
              <span className="text-xl font-semibold text-charcoal-900 w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-soft transition-premium hover:bg-cream-100 btn-press"
              >
                <Plus className="w-4 h-4 text-charcoal-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Add to cart button */}
        <div className="px-6 pb-8 pt-2">
          <button
            onClick={handleAddToCart}
            className="w-full bg-charcoal-900 text-white py-4 rounded-2xl font-semibold text-base shadow-soft-lg transition-premium hover:bg-charcoal-800 btn-press flex items-center justify-center gap-3"
          >
            <span>Add to Cart</span>
            <span className="bg-white/20 px-3 py-1 rounded-lg">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>

      {/* Origin Modal */}
      {showOrigin && originData && (
        <OriginModal
          origin={originData}
          onClose={() => setShowOrigin(false)}
        />
      )}
    </div>
  );
}

export default ProductDetail;
