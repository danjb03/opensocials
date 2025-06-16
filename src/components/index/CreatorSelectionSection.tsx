
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TrendingUp } from "lucide-react";

export const CreatorSelectionSection = () => {
  const creators = [
    {
      name: "Sarah Chen",
      handle: "@sarahstyle",
      platform: "Instagram",
      followers: "125K",
      engagement: "4.2%",
      location: "Los Angeles, CA",
      categories: ["Fashion", "Lifestyle"],
      image: "/placeholder.svg"
    },
    {
      name: "Alex Rodriguez", 
      handle: "@alexfitness",
      platform: "TikTok",
      followers: "89K",
      engagement: "6.8%",
      location: "Miami, FL", 
      categories: ["Fitness", "Wellness"],
      image: "/placeholder.svg"
    },
    {
      name: "Emma Johnson",
      handle: "@emmaeats",
      platform: "YouTube",
      followers: "245K",
      engagement: "3.9%",
      location: "Austin, TX",
      categories: ["Food", "Travel"],
      image: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-white">
            Discover authentic creators
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Access our network of verified creators across all major platforms. 
            Find the perfect match for your brand and campaign goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {creators.map((creator, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-800"></div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white">{creator.name}</h3>
                    <p className="text-gray-400">{creator.handle}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{creator.followers}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{creator.engagement}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{creator.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {creator.categories.map((category, catIndex) => (
                      <Badge key={catIndex} variant="secondary" className="bg-gray-800 text-gray-300">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
            Browse All Creators
          </Button>
        </div>
      </div>
    </section>
  );
};
