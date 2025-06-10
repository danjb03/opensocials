
export const StatsSection = () => {
  const stats = [
    {
      number: "100+",
      label: "Creators Onboard"
    },
    {
      number: "500+", 
      label: "Brands Active"
    },
    {
      number: "24hrs",
      label: "Average deal speed"
    }
  ];

  return (
    <section className="py-32 px-6 border-t border-gray-800 relative overflow-hidden">
      {/* Faded background design */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-br from-white/20 to-transparent rounded-[40px] rotate-12"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-br from-white/15 to-transparent rounded-[30px] -rotate-6"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-gradient-to-br from-white/10 to-transparent rounded-[20px] rotate-3"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
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
