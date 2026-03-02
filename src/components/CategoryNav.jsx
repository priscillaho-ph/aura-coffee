import { Coffee, Snowflake, Leaf, Croissant } from 'lucide-react';
import { categories } from '../data/products';

const iconMap = {
  Coffee: Coffee,
  Snowflake: Snowflake,
  Leaf: Leaf,
  Croissant: Croissant,
};

function CategoryNav({ activeCategory, onCategoryChange }) {
  return (
    <nav className="px-4 max-w-lg mx-auto">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {categories.map((category) => {
          const Icon = iconMap[category.icon];
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap
                transition-premium btn-press font-medium text-sm
                ${isActive
                  ? 'bg-charcoal-900 text-white shadow-soft'
                  : 'bg-white text-charcoal-600 hover:bg-cream-100'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default CategoryNav;
