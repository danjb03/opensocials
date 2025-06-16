
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <section className="py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="text-gray-400 text-lg font-medium">loom</div>
            </div>
            <p className="text-white text-xl leading-relaxed font-light">
              "Creative, innovative and strategic. We have great achievements made together and looking to more"
            </p>
            <div className="flex text-yellow-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="space-y-1">
              <div className="text-white font-medium">Henry Arthur</div>
              <div className="text-gray-400 text-sm">Head of Engineering, Loom</div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="text-gray-400 text-lg font-medium">INTERCOM</div>
            </div>
            <p className="text-white text-xl leading-relaxed font-light">
              "Incredible group of people and talented professionals. Focused on the development of flexible ideas"
            </p>
            <div className="flex text-yellow-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="space-y-1">
              <div className="text-white font-medium">Jerome Bell</div>
              <div className="text-gray-400 text-sm">Product Analyst, Intercom</div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="text-gray-400 text-lg font-medium">Abstract</div>
            </div>
            <p className="text-white text-xl leading-relaxed font-light">
              "A truly innovative approach to partnerships that sets this platform apart from its peers within the broader industry"
            </p>
            <div className="flex text-yellow-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="space-y-1">
              <div className="text-white font-medium">Eleanor Pena</div>
              <div className="text-gray-400 text-sm">Head of Product Design, Abstract</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
