
export const WorkflowSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-light mb-6">Workflow integration</h3>
            <p className="text-gray-400 text-lg mb-8">Seamlessly connect all your existing apps.</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
              <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
              <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
              <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
              <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-light mb-6">Collaborate real-time</h3>
            <p className="text-gray-400 text-lg">Seamlessly connect all your existing apps.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
