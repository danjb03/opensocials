
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, BarChart3, CreditCard } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Smart Discovery",
      description: "Find the perfect creators for your brand using AI-powered matching and comprehensive analytics."
    },
    {
      icon: Users,
      title: "Campaign Management",
      description: "Streamline your influencer campaigns from brief to delivery with our intuitive workflow tools."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track campaign performance with detailed insights and ROI metrics across all platforms."
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Automated payment processing with milestone-based releases and transparent fee structure."
    }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-white">
            Everything you need to scale
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our platform provides all the tools you need to discover, manage, and measure 
            successful creator partnerships.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
