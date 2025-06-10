

export const StatsSection = () => {
  const stats = [
    {
      number: "1000+",
      label: "Creators"
    },
    {
      number: "500+", 
      label: "Brands"
    },
    {
      number: "24hrs",
      label: "Average deal speed"
    }
  ];

  return (
    <section className="py-32 px-6 border-t border-gray-800">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="text-7xl md:text-8xl font-light text-white tracking-tight">
                {stat.number}
              </div>
              <div className="text-gray-400 text-lg font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

