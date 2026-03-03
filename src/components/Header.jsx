import { ShoppingBag, User } from 'lucide-react';

function Header({ cartItemCount, onCartClick, onProfileClick, badgeCount = 0 }) {
  return (
    <header className="sticky top-0 z-40 bg-cream-50/80 backdrop-blur-lg border-b border-charcoal-100/50">
      <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <span className="font-display text-xl text-charcoal-900">Aura Coffee</span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onProfileClick}
            className="relative w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center transition-premium hover:bg-cream-200 btn-press"
          >
            <User className="w-5 h-5 text-charcoal-600" />
            {badgeCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-sage-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                {badgeCount}
              </span>
            )}
          </button>

          <button
            onClick={onCartClick}
            className="relative w-10 h-10 rounded-full bg-charcoal-900 flex items-center justify-center transition-premium hover:bg-charcoal-800 btn-press"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-sage-500 text-white text-xs font-semibold rounded-full flex items-center justify-center animate-fade-in">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
