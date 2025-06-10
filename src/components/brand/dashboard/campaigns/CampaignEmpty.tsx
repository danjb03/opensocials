
import { FileEdit, Plus, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CampaignEmptyProps {
  onCreateCampaign?: () => void;
  showCreateButton?: boolean;
}

export function CampaignEmpty({ onCreateCampaign, showCreateButton = true }: CampaignEmptyProps) {
  const features = [
    {
      icon: Users,
      title: "Connect with Creators",
      description: "Find and collaborate with top influencers"
    },
    {
      icon: Target,
      title: "Track Performance",
      description: "Monitor campaign metrics and ROI"
    },
    {
      icon: FileEdit,
      title: "Manage Content",
      description: "Review and approve creator content"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <Card className="w-full max-w-2xl shadow-sm border-dashed">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-scale-in">
              <FileEdit className="h-8 w-8 text-primary" />
            </div>
            
            {/* Header */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Ready to launch your first campaign?
              </h3>
              <p className="text-foreground max-w-md mx-auto">
                Create marketing campaigns to start working with creators and grow your brand's reach.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="p-4 rounded-lg bg-muted/30 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <feature.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Button */}
            {showCreateButton && onCreateCampaign && (
              <Button 
                onClick={onCreateCampaign}
                size="lg"
                className="gap-2 px-8 animate-slide-up"
              >
                <Plus className="h-5 w-5" />
                Create Your First Campaign
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
