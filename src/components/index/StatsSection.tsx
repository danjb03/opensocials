
export const StatsSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl md:text-6xl font-light text-white mb-2">45+</div>
            <div className="text-gray-400">Happy customers</div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-light text-white mb-2">5k+</div>
            <div className="text-gray-400">Hours spent on craft</div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-light text-white mb-2">4.8</div>
            <div className="text-gray-400">Review rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};
