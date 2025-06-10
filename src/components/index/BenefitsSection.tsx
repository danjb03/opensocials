
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, AlignJustify } from "lucide-react";

export const BenefitsSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-900/90 border border-gray-700/50 p-8 rounded-3xl backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl font-bold">01</span>
                </div>
                <div className="mb-6">
                  <TrendingUp className="w-12 h-12 text-white stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
                You Can Focus on<br />
                Scaling Your<br />
                Business
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                You focus on scaling your business. We turn your digital presence into a revenue generating asset.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/90 border border-gray-700/50 p-8 rounded-3xl backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl font-bold">02</span>
                </div>
                <div className="mb-6">
                  <Clock className="w-12 h-12 text-white stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
                Your Time is Too<br />
                Valuable to Waste on<br />
                Social Media
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Figuring out algorithms and posting consistently shouldn't be on your plate. We take care of strategy and execution.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/90 border border-gray-700/50 p-8 rounded-3xl backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl font-bold">03</span>
                </div>
                <div className="mb-6">
                  <AlignJustify className="w-12 h-12 text-white stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
                Stop Leaving Money<br />
                on the Table
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                We secure sponsorships, brand deals, and strategic partnerships that turn your influence into income.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
