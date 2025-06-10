
export const FeaturesGrid = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
            <span className="text-white text-sm">Creator matching</span>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
            <span className="text-white text-sm">Campaign management</span>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
            <span className="text-white text-sm">Performance tracking</span>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
            <span className="text-white text-sm">Asset management</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
            <span className="text-white text-sm">Secure payments</span>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
            <span className="text-white text-sm">Brand safety</span>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-3"></div>
            <span className="text-white text-sm">Multi-platform support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
