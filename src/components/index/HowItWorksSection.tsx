import { Card, CardContent } from "@/components/ui/card";

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gray-900 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-blue-400 text-sm uppercase tracking-wider">How it works</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-8">
            Sponsorships, streamlined.<br />
            <span className="text-gray-400">Results, delivered.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl text-center">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 border-2 border-white rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Drop the brief</h3>
              <p className="text-gray-400">Tell us what you need, audience, goals, budget.</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl text-center">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Get matched</h3>
              <p className="text-gray-400">Sit back and relax; our expert team will turn your vision into reality.</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl text-center">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Launch & scale</h3>
              <p className="text-gray-400">Campaign goes live. We handle the logistics. You stay focused on results.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
