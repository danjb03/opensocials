
import { Card, CardContent } from "@/components/ui/card";

export const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Create Your Campaign",
      description: "Define your campaign goals, target audience, and budget. Our AI will suggest the best creators for your needs."
    },
    {
      number: "2", 
      title: "Connect with Creators",
      description: "Send invitations to selected creators with detailed briefs. Review proposals and negotiate terms directly on the platform."
    },
    {
      number: "3",
      title: "Manage & Monitor", 
      description: "Track progress with real-time updates, provide feedback, and ensure deliverables meet your standards."
    },
    {
      number: "4",
      title: "Measure Success",
      description: "Access comprehensive analytics to measure campaign performance and calculate ROI across all platforms."
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-white">
            Simple process, powerful results
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our proven methodology takes the complexity out of influencer marketing 
            while maximizing your campaign effectiveness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="bg-gray-900/30 border-gray-800">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="h-12 w-12 bg-white text-black rounded-full flex items-center justify-center font-medium text-lg flex-shrink-0">
                    {step.number}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-light text-white">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
