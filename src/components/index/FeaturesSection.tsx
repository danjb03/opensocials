
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, BarChart3 } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gray-900 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-blue-400 text-sm uppercase tracking-wider">What you'll get</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-8">
            We don't just manage,<br />
            <span className="text-gray-400">we monetise.</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            Social Media is a business tool. If your content isn't turning into clients, deals and serious revenue you're leaving money on the table.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border border-gray-700/50 p-8 rounded-3xl backdrop-blur-sm shadow-2xl shadow-gray-900/20 bg-slate-300">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gray-900/30">
                  <TrendingUp className="w-10 h-10 text-white stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-2xl font-light text-white mb-4">High-performing creators.</h3>
              <p className="text-lg leading-relaxed text-slate-200">Pre-vetted. High-performing. Ready to go live.</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border border-gray-700/50 p-8 rounded-3xl backdrop-blur-sm shadow-2xl shadow-gray-900/20">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gray-900/30">
                  <Target className="w-10 h-10 text-white stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Zero back-and-forth.</h3>
              <p className="text-gray-400 text-lg leading-relaxed">Drop in your own briefs, set your terms, and start the deal.</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border border-gray-700/50 p-8 rounded-3xl backdrop-blur-sm shadow-2xl shadow-gray-900/20">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gray-900/30">
                  <BarChart3 className="w-10 h-10 text-white stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Smart filters. Instant launch.</h3>
              <p className="text-gray-400 text-lg leading-relaxed">See ROI, engagement, and creator performance live.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
