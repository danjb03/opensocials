
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardContent className="p-0">
              <div className="text-gray-600 font-semibold mb-4">loom</div>
              <p className="text-white mb-6">"Creative, innovative and strategic. We have great achievements made together and looking to more"</p>
              <div className="flex text-blue-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div>
                <div className="text-white font-medium">Henry Arthur</div>
                <div className="text-gray-400 text-sm">Head of Engineering, Loom</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardContent className="p-0">
              <div className="text-gray-600 font-semibold mb-4">INTERCOM</div>
              <p className="text-white mb-6">"Incredible group of people and talented professionals. Focused on the development of flexible ideas"</p>
              <div className="flex text-blue-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div>
                <div className="text-white font-medium">Jerome Bell</div>
                <div className="text-gray-400 text-sm">Product Analyst, Intercom</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 rounded-3xl">
            <CardContent className="p-0">
              <div className="text-gray-600 font-semibold mb-4">Abstract</div>
              <p className="text-white mb-6">"A truly innovative approach to partnerships that sets this platform apart from its peers within the broader industry"</p>
              <div className="flex text-blue-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div>
                <div className="text-white font-medium">Eleanor Pena</div>
                <div className="text-gray-400 text-sm">Head of Product Design, Abstract</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
