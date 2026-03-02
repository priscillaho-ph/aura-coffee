function HeroSection() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <section className="px-4 pt-6 pb-2 max-w-lg mx-auto">
      <div className="animate-fade-in">
        <p className="text-charcoal-500 text-sm font-medium tracking-wide uppercase">
          {getGreeting()}
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-charcoal-900 mt-1">
          What will you have today?
        </h1>
      </div>
    </section>
  );
}

export default HeroSection;
