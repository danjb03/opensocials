
import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Clock, Upload, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  contentRequirements: any;
  brandId: string;
  brandName?: string;
  brandLogo?: string | null;
  platforms: string[];
  dealId: string;
  value: number;
  contentUploaded: boolean;
}

interface CampaignListProps {
  campaigns: Campaign[];
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns }) => {
  const navigate = useNavigate();

  const getStatusBadge = (campaign: Campaign) => {
    const today = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    
    if (endDate < today || campaign.status === 'completed') {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-200 hover:scale-105">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    } else if (startDate > today) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-all duration-200 hover:scale-105">
          <Calendar className="h-3 w-3 mr-1" />
          Upcoming
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-all duration-200 hover:scale-105 animate-pulse-glow">
          <Clock className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
  };

  const handleCampaignClick = (campaign: Campaign) => {
    navigate(`/creator/campaigns/${campaign.id}`);
  };

  return (
    <div className="space-y-4">
      {campaigns.map((campaign, index) => (
        <div
          key={campaign.id}
          className="animate-stagger-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Card className="hover:border-primary/50 transition-all duration-300 group cursor-pointer" onClick={() => handleCampaignClick(campaign)}>
            <CardContent className="p-0">
              <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-md transition-transform group-hover:scale-110 duration-200">
                    {campaign.brandLogo ? (
                      <AvatarImage src={campaign.brandLogo} alt={campaign.brandName} />
                    ) : (
                      <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                        {campaign.brandName?.substring(0, 2) || 'BR'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg leading-tight group-hover:text-primary transition-colors duration-200">
                      {campaign.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="group-hover:text-foreground transition-colors duration-200">{campaign.brandName}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                      <span className="group-hover:text-foreground transition-colors duration-200">
                        {format(new Date(campaign.startDate), 'MMM d')} - {format(new Date(campaign.endDate), 'MMM d, yyyy')}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                      <span className="font-medium text-primary group-hover:scale-105 transition-transform duration-200">
                        ${campaign.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 ml-auto">
                  {getStatusBadge(campaign)}
                  
                  {campaign.contentUploaded ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-all duration-200 hover:scale-105">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Content Uploaded
                    </Badge>
                  ) : new Date() > new Date(campaign.startDate) && new Date() < new Date(campaign.endDate) ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/creator/campaigns/${campaign.id}/upload`);
                      }}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md animate-float"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Content
                    </Button>
                  ) : null}
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-auto hover:bg-gray-50 transition-all duration-200 group/btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCampaignClick(campaign);
                    }}
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1 duration-200" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default CampaignList;
