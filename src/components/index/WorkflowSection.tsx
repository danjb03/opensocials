
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const WorkflowSection = () => {
  const steps = [
    {
      step: "01",
      title: "Discover",
      description: "Browse our curated network of verified creators or use AI-powered matching to find the perfect fit for your brand."
    },
    {
      step: "02", 
      title: "Connect",
      description: "Send collaboration invites with detailed briefs. Creators can accept and negotiate terms directly through the platform."
    },
    {
      step: "03",
      title: "Create",
      description: "Manage content creation with milestone tracking, feedback tools, and real-time collaboration features."
    },
    {
      step: "04",
      title: "Deliver",
      description: "Review and approve content, track performance metrics, and process payments automatically upon completion."
    }
  ];

  return (
    <section id="workflow" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-white">
            How it works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From discovery to delivery, our streamlined workflow makes creator partnerships simple and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-black/40 border-gray-800 h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="text-sm font-mono text-gray-500">{step.step}</div>
                  <h3 className="text-2xl font-light text-white">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
