
export const StatsSection = () => {
  const stats = [
    { value: "10K+", label: "Active Creators" },
    { value: "500+", label: "Brand Partners" },
    { value: "$50M+", label: "Creator Earnings" },
    { value: "98%", label: "Success Rate" }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-light">
            Trusted by thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join the fastest-growing creator partnership platform and see why 
            brands and creators choose us for their collaborations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-light mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
