
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InterestRegistrationModal } from "./InterestRegistrationModal";
export const CreatorSelectionSection = () => {
  const [selectedCreatorId, setSelectedCreatorId] = useState(1);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const creators = [{
    id: 1,
    name: "Sarah",
    image: "/lovable-uploads/e4e5b130-826a-4835-aa50-1bf5466c18c9.png",
    specialty: "Fashion & Lifestyle",
    followers: "125K",
    engagement: "4.2%",
    borderColor: "border-purple-500"
  }, {
    id: 2,
    name: "Marcus",
    image: "/lovable-uploads/e4e5b130-826a-4835-aa50-1bf5466c18c9.png",
    specialty: "Tech & Gaming",
    followers: "89K",
    engagement: "5.1%",
    borderColor: "border-cyan-500"
  }, {
    id: 3,
    name: "Elena",
    image: "/lovable-uploads/e4e5b130-826a-4835-aa50-1bf5466c18c9.png",
    specialty: "Beauty & Wellness",
    followers: "203K",
    engagement: "3.8%",
    borderColor: "border-yellow-500"
  }];
  const handleCreatorSelect = (creatorId: number) => {
    setSelectedCreatorId(creatorId);
  };
  return <>
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Creator selection interface */}
            <div className="relative">
              <Card className="bg-gray-900/50 border border-gray-700/30 rounded-3xl p-8 backdrop-blur-sm">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-light text-white mb-2">
                    Find the right creator,
                  </h3>
                  <h4 className="text-xl text-white mb-6">
                    instantly.
                  </h4>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Seamlessly connect all your existing apps.
                  </p>
                  
                  {/* Creator selection interface */}
                  <div className="space-y-4">
                    {creators.map(creator => <div key={creator.id} className={`flex items-center space-x-4 p-4 rounded-2xl bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group ${selectedCreatorId === creator.id ? 'ring-2 ring-purple-500/50' : ''}`} onClick={() => handleCreatorSelect(creator.id)}>
                        <div className={`relative w-12 h-12 rounded-full border-3 ${creator.borderColor} overflow-hidden`}>
                          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                            <span className="text-white font-medium">{creator.name[0]}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white font-medium">{creator.name}</h5>
                          <p className="text-gray-400 text-sm">{creator.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-sm font-medium">{creator.followers}</p>
                          <p className="text-gray-400 text-xs">{creator.engagement} eng.</p>
                        </div>
                      </div>)}
                  </div>

                  {/* Chat bubble - only show for selected creator */}
                  {selectedCreatorId && <div className="relative mt-6">
                      <div className="bg-yellow-400 text-black px-4 py-2 rounded-2xl rounded-bl-sm inline-block ml-auto cursor-pointer hover:bg-yellow-300 transition-colors" onClick={() => setShowInterestModal(true)}>
                        <span className="font-medium">Perfect match!</span>
                      </div>
                    </div>}
                </CardContent>
              </Card>

              {/* Floating decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/20 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-cyan-500/10 rounded-full"></div>
            </div>

            {/* Right side - Text content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-gray-900 rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-blue-400 text-sm uppercase tracking-wider">Creator Matching</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
                Select the creator<br />
                <span className="text-gray-400">that's perfect for you</span>
              </h2>
              <p className="text-lg leading-relaxed mb-8 text-slate-300">
                Our conversation-first matching system filters by niche performance so you only see creators who align with your campaign goals and drive results.
              </p>
              <div className="space-y-4">
                <Button onClick={() => setShowInterestModal(true)} className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-medium">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <InterestRegistrationModal open={showInterestModal} onOpenChange={setShowInterestModal} />
    </>;
};
