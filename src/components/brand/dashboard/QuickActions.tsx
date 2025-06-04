
import React, { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, BarChart2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = React.memo(() => {
  const navigate = useNavigate();

  const actions = useMemo(() => [
    {
      title: "Find Creators",
      description: "Instantly see who's right for your campaign",
      icon: Search,
      route: '/brand/creators',
      buttonText: "Browse Creators"
    },
    {
      title: "Create Campaign",
      description: "Step-by-step campaign creation with creator selection",
      icon: Zap,
      route: '/brand/create-campaign',
      buttonText: "Start Campaign"
    },
    {
      title: "Campaign Management", 
      description: "End-to-end campaign control. Track progress and keep every deal on course",
      icon: Calendar,
      route: '/brand/orders',
      buttonText: "Manage Campaigns"
    },
    {
      title: "View Analytics",
      description: "Track performance and measure campaign ROI",
      icon: BarChart2,
      route: '/brand/analytics',
      buttonText: "See Analytics"
    }
  ], []);

  const handleActionClick = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  const handleButtonClick = useCallback((e: React.MouseEvent, route: string) => {
    e.stopPropagation();
    navigate(route);
  }, [navigate]);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full" onClick={() => handleActionClick(action.route)}>
              <CardHeader className="pb-3 flex-grow">
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
              <CardContent className="pt-0 mt-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  onClick={(e) => handleButtonClick(e, action.route)}
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
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
