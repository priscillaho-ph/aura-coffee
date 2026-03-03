import { X, Mountain, Droplets, Coffee, Calendar } from 'lucide-react';

const factIcons = {
  'Altitude': Mountain,
  'Process': Droplets,
  'Flavor Profile': Coffee,
  'Harvest': Calendar,
  'Roast': Coffee,
};

function OriginModal({ origin, onClose }) {
  if (!origin) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/60 animate-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-cream-50 w-full max-w-lg rounded-t-3xl max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-charcoal-900/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-premium hover:bg-charcoal-900/70 btn-press"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Hero Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={origin.heroImage}
            alt={origin.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
              Origin
            </p>
            <h2 className="font-display text-2xl text-white">
              {origin.name}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {origin.region}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(85vh-12rem)]">
          {/* Description */}
          <p className="text-charcoal-600 text-sm leading-relaxed">
            {origin.description}
          </p>

          {/* Quick Facts */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">
              Quick Facts
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {origin.facts.map((fact) => {
                const Icon = factIcons[fact.label] || Coffee;
                return (
                  <div
                    key={fact.label}
                    className="bg-white rounded-xl p-4 shadow-soft"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-sage-600" />
                      </div>
                      <span className="text-xs text-charcoal-400 uppercase tracking-wide">
                        {fact.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-charcoal-900">
                      {fact.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OriginModal;
