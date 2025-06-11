
import { Card, CardContent } from "@/components/ui/card";

export const BenefitsSection = () => {
  const benefits = [
    {
      title: "Creator matching",
      description: "Get matched with high-performing creators based on niche, audience, and conversion data."
    },
    {
      title: "Campaign management", 
      description: "Upload briefs, assign creators, track deliverables all from one streamlined dashboard."
    },
    {
      title: "Performance tracking",
      description: "Live analytics on reach, clicks, and ROI. See what's working as it happens."
    },
    {
      title: "Asset management",
      description: "One hub for briefs, contracts, and content: no lost files, no scattered links."
    },
    {
      title: "Secure payments",
      description: "Pay creators with confidence. Tracked and protected."
    },
    {
      title: "Brand safety",
      description: "Advanced content moderation and brand guideline enforcement tools"
    },
    {
      title: "Multi-platform support",
      description: "Seamless campaign execution across Instagram, TikTok, YouTube, and more"
    }
  ];

  return (
    <section className="py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-light mb-8">
            Everything you need to<br />
            <span className="text-gray-400">scale your influence.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.slice(0, 4).map((benefit, index) => (
            <div key={index} className="bg-gray-800/60 border border-gray-700/40 rounded-2xl p-8 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300 group relative">
              {/* Green accent dot */}
              <div className="absolute top-6 left-6">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {benefits.slice(4).map((benefit, index) => (
            <div key={index + 4} className="bg-gray-800/60 border border-gray-700/40 rounded-2xl p-8 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300 group relative">
              {/* Green accent dot */}
              <div className="absolute top-6 left-6">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
