
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";

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
            We resolve problems associated with<br />
            <span className="text-gray-400">creative partnerships.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="text-blue-400 text-sm font-medium mb-4">Growth</div>
                <div className="h-32 bg-gradient-to-t from-blue-600 to-blue-400 opacity-20 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Tailor-made partnerships</h3>
              <p className="text-gray-400">We've got the expertise to make your vision a reality.</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="bg-gray-800 rounded-lg p-6 h-32 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Latest design</h3>
              <p className="text-gray-400">Today, 11:30</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="h-32 flex items-end">
                  <div className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 rounded-lg"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Scalable as you grow</h3>
              <p className="text-gray-400">We're ready to meet your evolving needs.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
