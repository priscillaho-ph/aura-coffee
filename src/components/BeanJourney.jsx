import { useState } from 'react';
import { X, MapPin, Award, Coffee, Globe, Compass, Heart, Crown, Sun, Moon, Snowflake, Zap, Repeat, Sunrise, ChevronRight } from 'lucide-react';
import CoffeeMap from './CoffeeMap';
import { coffeeRegions, badges, tierColors, originToCountry } from '../data/coffeeRegions';
import { origins } from '../data/origins';

const badgeIcons = {
  coffee: Coffee,
  repeat: Repeat,
  award: Award,
  globe: Globe,
  compass: Compass,
  sun: Sun,
  heart: Heart,
  crown: Crown,
  sunrise: Sunrise,
  moon: Moon,
  snowflake: Snowflake,
  zap: Zap,
};

function BeanJourney({ onClose, triedOrigins = [], orderHistory = [] }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeTab, setActiveTab] = useState('map');

  // Calculate tried countries from tried origins
  const triedCountries = [...new Set(
    triedOrigins
      .map(origin => originToCountry[origin])
      .filter(Boolean)
  )];

  // Calculate total orders and category counts
  const totalOrders = orderHistory.length;
  const categoryCounts = orderHistory.reduce((acc, order) => {
    acc[order.category] = (acc[order.category] || 0) + 1;
    return acc;
  }, {});

  // Calculate earned badges
  const earnedBadges = badges.filter(badge => {
    const req = badge.requirement;

    switch (req.type) {
      case 'orders':
        return totalOrders >= req.count;

      case 'countries':
        return triedCountries.length >= req.count;

      case 'specific-countries':
        return req.countries.every(c => triedCountries.includes(c));

      case 'all-origins':
        const availableOrigins = Object.keys(originToCountry).filter(o => originToCountry[o]);
        return availableOrigins.every(o => triedOrigins.includes(o));

      case 'category':
        return (categoryCounts[req.category] || 0) >= req.count;

      case 'time':
        return orderHistory.some(order => {
          const hour = new Date(order.timestamp).getHours();
          if (req.before) return hour < req.before;
          if (req.after) return hour >= req.after;
          return false;
        });

      default:
        return false;
    }
  });

  // Calculate progress stats
  const availableCountries = Object.values(coffeeRegions).filter(r => r.origins.length > 0).length;
  const availableOrigins = Object.keys(originToCountry).filter(o => originToCountry[o]).length;

  const handleCountryClick = (countryName) => {
    setSelectedCountry(coffeeRegions[countryName]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/40 animate-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-cream-50 w-full max-w-lg rounded-t-3xl max-h-[92vh] flex flex-col animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-soft transition-premium hover:bg-cream-100 btn-press"
        >
          <X className="w-5 h-5 text-charcoal-600" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="font-display text-2xl text-charcoal-900">Bean Journey</h2>
          <p className="text-charcoal-500 text-sm mt-1">Track your coffee exploration</p>
        </div>

        {/* Stats Row */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-soft">
              <div className="text-2xl font-display text-charcoal-900">{triedCountries.length}</div>
              <div className="text-xs text-charcoal-500 mt-0.5">Countries</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-soft">
              <div className="text-2xl font-display text-charcoal-900">{triedOrigins.length}</div>
              <div className="text-xs text-charcoal-500 mt-0.5">Origins</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-soft">
              <div className="text-2xl font-display text-charcoal-900">{earnedBadges.length}</div>
              <div className="text-xs text-charcoal-500 mt-0.5">Badges</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pb-4">
          <div className="flex bg-white rounded-xl p-1 shadow-soft">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-premium btn-press ${
                activeTab === 'map'
                  ? 'bg-charcoal-900 text-white'
                  : 'text-charcoal-600 hover:bg-cream-100'
              }`}
            >
              <Globe className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Map
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-premium btn-press ${
                activeTab === 'badges'
                  ? 'bg-charcoal-900 text-white'
                  : 'text-charcoal-600 hover:bg-cream-100'
              }`}
            >
              <Award className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Badges
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {activeTab === 'map' ? (
            <div className="space-y-4">
              {/* World Map */}
              <CoffeeMap
                triedCountries={triedCountries}
                onCountryClick={handleCountryClick}
              />

              {/* Progress Bar */}
              <div className="bg-white rounded-xl p-4 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-charcoal-900">World Progress</span>
                  <span className="text-sm text-charcoal-500">
                    {triedCountries.length} / {availableCountries} countries
                  </span>
                </div>
                <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sage-500 rounded-full transition-all duration-500"
                    style={{ width: `${(triedCountries.length / availableCountries) * 100}%` }}
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">
                  Coffee Origins
                </h3>
                {Object.entries(coffeeRegions)
                  .filter(([_, region]) => region.origins.length > 0)
                  .map(([name, region]) => {
                    const isTried = triedCountries.includes(name);
                    const triedOriginsInCountry = region.origins.filter(o => triedOrigins.includes(o));

                    return (
                      <button
                        key={region.id}
                        onClick={() => setSelectedCountry(region)}
                        className="w-full bg-white rounded-xl p-4 shadow-soft text-left transition-premium hover:bg-cream-50 btn-press"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{region.flag}</span>
                            <div>
                              <div className="font-medium text-charcoal-900">{name}</div>
                              <div className="text-xs text-charcoal-500">
                                {region.region} · {triedOriginsInCountry.length}/{region.origins.length} origins
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isTried && (
                              <span className="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
                                Explored
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-charcoal-400" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Coming Soon */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">
                  Coming Soon
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(coffeeRegions)
                    .filter(([_, region]) => region.comingSoon)
                    .map(([name, region]) => (
                      <div
                        key={region.id}
                        className="bg-white/50 rounded-xl p-3 text-center opacity-60"
                      >
                        <span className="text-xl">{region.flag}</span>
                        <div className="text-sm text-charcoal-600 mt-1">{name}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Earned Badges */}
              {earnedBadges.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">
                    Earned ({earnedBadges.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {earnedBadges.map((badge) => {
                      const Icon = badgeIcons[badge.icon] || Award;
                      const colors = tierColors[badge.tier];

                      return (
                        <div
                          key={badge.id}
                          className={`${colors.bg} rounded-xl p-3 text-center border ${colors.border}`}
                        >
                          <div className={`w-10 h-10 mx-auto rounded-full bg-white flex items-center justify-center mb-2`}>
                            <Icon className={`w-5 h-5 ${colors.icon}`} />
                          </div>
                          <div className={`text-xs font-semibold ${colors.text}`}>
                            {badge.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Locked Badges */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">
                  {earnedBadges.length > 0 ? 'Locked' : 'All Badges'} ({badges.length - earnedBadges.length})
                </h3>
                <div className="space-y-2">
                  {badges
                    .filter(badge => !earnedBadges.includes(badge))
                    .map((badge) => {
                      const Icon = badgeIcons[badge.icon] || Award;
                      const colors = tierColors[badge.tier];

                      // Calculate progress
                      let progress = 0;
                      let progressText = '';
                      const req = badge.requirement;

                      if (req.type === 'orders') {
                        progress = Math.min(totalOrders / req.count, 1);
                        progressText = `${totalOrders}/${req.count} orders`;
                      } else if (req.type === 'countries') {
                        progress = Math.min(triedCountries.length / req.count, 1);
                        progressText = `${triedCountries.length}/${req.count} countries`;
                      } else if (req.type === 'specific-countries') {
                        const have = req.countries.filter(c => triedCountries.includes(c)).length;
                        progress = have / req.countries.length;
                        progressText = `${have}/${req.countries.length} countries`;
                      } else if (req.type === 'category') {
                        const have = categoryCounts[req.category] || 0;
                        progress = Math.min(have / req.count, 1);
                        progressText = `${have}/${req.count} orders`;
                      } else if (req.type === 'all-origins') {
                        progress = triedOrigins.length / availableOrigins;
                        progressText = `${triedOrigins.length}/${availableOrigins} origins`;
                      }

                      return (
                        <div
                          key={badge.id}
                          className="bg-white rounded-xl p-4 shadow-soft"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-charcoal-100 flex items-center justify-center">
                              <Icon className="w-6 h-6 text-charcoal-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-charcoal-900">{badge.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                                  {badge.tier}
                                </span>
                              </div>
                              <div className="text-xs text-charcoal-500 mt-0.5">{badge.description}</div>
                              {progressText && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-[10px] text-charcoal-400 mb-1">
                                    <span>{progressText}</span>
                                    <span>{Math.round(progress * 100)}%</span>
                                  </div>
                                  <div className="h-1.5 bg-cream-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-charcoal-300 rounded-full transition-all duration-500"
                                      style={{ width: `${progress * 100}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Country Detail Modal */}
        {selectedCountry && (
          <div className="absolute inset-0 z-10 flex items-end justify-center">
            <div
              className="absolute inset-0 bg-charcoal-900/20"
              onClick={() => setSelectedCountry(null)}
            />
            <div className="relative bg-white w-full rounded-t-3xl max-h-[70vh] overflow-y-auto animate-slide-up shadow-soft-lg">
              <button
                onClick={() => setSelectedCountry(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-cream-100 rounded-full flex items-center justify-center transition-premium hover:bg-cream-200 btn-press"
              >
                <X className="w-4 h-4 text-charcoal-600" />
              </button>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="font-display text-xl text-charcoal-900">{selectedCountry.name}</h3>
                    <p className="text-sm text-charcoal-500">{selectedCountry.region}</p>
                  </div>
                </div>

                <p className="text-charcoal-600 text-sm mb-6">{selectedCountry.description}</p>

                <h4 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">
                  Available Origins
                </h4>
                <div className="space-y-2">
                  {selectedCountry.origins.map((originName) => {
                    const originData = origins[originName];
                    const isTried = triedOrigins.includes(originName);

                    return (
                      <div
                        key={originName}
                        className={`rounded-xl p-4 ${isTried ? 'bg-sage-50 border border-sage-200' : 'bg-cream-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-4 h-4 ${isTried ? 'text-sage-600' : 'text-charcoal-400'}`} />
                            <span className={`font-medium ${isTried ? 'text-sage-700' : 'text-charcoal-700'}`}>
                              {originName}
                            </span>
                          </div>
                          {isTried && (
                            <span className="text-xs bg-sage-500 text-white px-2 py-0.5 rounded-full">
                              Tried
                            </span>
                          )}
                        </div>
                        {originData && (
                          <p className="text-xs text-charcoal-500 mt-2 ml-6">
                            {originData.facts.find(f => f.label === 'Flavor Profile')?.value}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BeanJourney;
