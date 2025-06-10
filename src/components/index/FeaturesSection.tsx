
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Handshake, TrendingUp } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gray-900 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
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
          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Revenue Growth</h3>
              <p className="text-gray-400">Turn your social media presence into a profitable revenue stream</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Monetization Strategy</h3>
              <p className="text-gray-400">Expert guidance on turning followers into customers</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Performance Tracking</h3>
              <p className="text-gray-400">Real-time analytics to maximize your social ROI</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
