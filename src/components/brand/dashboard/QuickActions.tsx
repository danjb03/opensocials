
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, BarChart2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Find Creators",
      description: "Instantly see who's right for your campaign",
      icon: Search,
      onClick: () => navigate('/brand/creators'),
      buttonText: "Browse Creators"
    },
    {
      title: "Create Campaign",
      description: "Step-by-step campaign creation with creator selection",
      icon: Zap,
      onClick: () => navigate('/brand/create-campaign'),
      buttonText: "Start Campaign"
    },
    {
      title: "Campaign Management", 
      description: "End-to-end campaign control. Track progress and keep every deal on course",
      icon: Calendar,
      onClick: () => navigate('/brand/orders'),
      buttonText: "Manage Campaigns"
    },
    {
      title: "View Analytics",
      description: "Track performance and measure campaign ROI",
      icon: BarChart2,
      onClick: () => navigate('/brand/analytics'),
      buttonText: "See Analytics"
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={action.onClick}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">{action.title}</CardTitle>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {action.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                >
                  {action.buttonText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
