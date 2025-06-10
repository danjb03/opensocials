
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, AlignJustify, Target, Shield, Zap, DollarSign } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Creator matching",
      description: "AI-powered matching system connects you with the perfect creators for your brand"
    },
    {
      icon: Target,
      title: "Campaign management", 
      description: "Streamlined workflow from brief creation to content delivery and performance tracking"
    },
    {
      icon: Clock,
      title: "Performance tracking",
      description: "Real-time analytics and insights to measure campaign success and ROI"
    },
    {
      icon: Zap,
      title: "Asset management",
      description: "Centralized hub for all your creative assets, briefs, and campaign materials"
    },
    {
      icon: Shield,
      title: "Secure payments",
      description: "Protected payment processing with automatic milestone-based creator compensation"
    },
    {
      icon: DollarSign,
      title: "Brand safety",
      description: "Advanced content moderation and brand guideline enforcement tools"
    },
    {
      icon: AlignJustify,
      title: "Multi-platform support",
      description: "Seamless campaign execution across Instagram, TikTok, YouTube, and more"
    }
  ];

  return (
    <section className="py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gray-900 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-blue-400 text-sm uppercase tracking-wider">Platform Features</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-8">
            Everything you need to<br />
            <span className="text-gray-400">scale your influence.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.slice(0, 4).map((benefit, index) => (
            <Card key={index} className="bg-gray-900/60 border border-gray-700/30 p-6 rounded-2xl backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  </div>
                  <benefit.icon className="w-8 h-8 text-gray-300 stroke-[1.5] mb-4" />
                </div>
                <h3 className="text-xl font-light text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6 max-w-5xl mx-auto">
          {benefits.slice(4).map((benefit, index) => (
            <Card key={index + 4} className="bg-gray-900/60 border border-gray-700/30 p-6 rounded-2xl backdrop-blur-sm hover:bg-gray-900/80 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  </div>
                  <benefit.icon className="w-8 h-8 text-gray-300 stroke-[1.5] mb-4" />
                </div>
                <h3 className="text-xl font-light text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
