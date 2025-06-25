
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { CreatorProfile } from '@/types/creatorProfile';
import { ArrowRight, CheckCircle, Star, TrendingUp, Users } from 'lucide-react';
import { SocialMediaConnectionPanel } from '@/components/creator/SocialMediaConnectionPanel';

interface ProfileEditTabProps {
  profileData: CreatorProfile | null;
  onSave: (updatedProfile: any) => Promise<void>;
  onCancel: () => void;
}

const ProfileEditTab: React.FC<ProfileEditTabProps> = ({ 
  profileData, 
  onSave, 
  onCancel 
}) => {
  const navigate = useNavigate();

  const handleComprehensiveSetup = () => {
    navigate('/creator/profile/complete-setup');
  };

  const setupBenefits = [
    {
      icon: Star,
      title: "Stand Out to Brands",
      description: "Complete profiles get 3x more collaboration opportunities"
    },
    {
      icon: TrendingUp,
      title: "Higher Earnings",
      description: "Detailed profiles command 40% higher rates on average"
    },
    {
      icon: Users,
      title: "Better Matches",
      description: "AI-powered matching connects you with perfect brand partnerships"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Social Media Connection Panel */}
      <SocialMediaConnectionPanel />

      {/* Enhanced Profile Setup Card */}
      <Card className="border-2 border-white/20 bg-gradient-to-br from-card via-card to-card/80 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                Complete Your Creator Profile
              </CardTitle>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Unlock your full earning potential by completing our comprehensive 4-step profile setup. 
                Brands are actively searching for creators like you.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {setupBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-white/10">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-white text-sm">{benefit.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Indicator */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Profile Completion</span>
              <span className="text-xs text-muted-foreground">
                {profileData?.isProfileComplete ? '100%' : '60%'} Complete
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: profileData?.isProfileComplete ? '100%' : '60%' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Complete all sections to maximize your visibility
            </p>
          </div>

          {/* Call to Action */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">Ready to get started?</p>
              <p className="text-xs text-muted-foreground">
                Takes 5-10 minutes • Save progress anytime
              </p>
            </div>
            <Button
              onClick={handleComprehensiveSetup}
              className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3 h-auto group"
            >
              Complete Setup
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="px-6"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditTab;
