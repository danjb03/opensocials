
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Globe, Award } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Verified Network",
      description: "All creators are verified and vetted for authenticity, engagement quality, and brand safety."
    },
    {
      icon: Zap,
      title: "Fast Execution",
      description: "Launch campaigns 3x faster with our streamlined workflow and automated processes."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access creators worldwide across all major platforms and market segments."
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Our platform delivers 40% higher engagement rates compared to traditional influencer marketing."
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-white">
            Why brands choose us
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We've built the most comprehensive platform for creator partnerships, 
            trusted by leading brands worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-black/40 border-gray-800">
              <CardContent className="p-6 text-center space-y-4">
                <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-white">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
