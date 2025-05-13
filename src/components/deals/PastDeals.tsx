
import React, { useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface Deal {
  id: string;
  title: string;
  description: string | null;
  value: number;
  status: string;
  feedback: string | null;
  creator_id: string;
  brand_id: string;
  created_at: string | null;
  updated_at: string | null;
  profiles: {
    company_name: string;
    logo_url?: string;
  };
}

interface PastDealsProps {
  deals: Deal[];
}

const PastDeals = ({ deals }: PastDealsProps) => {
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);
  
  const toggleExpandDeal = (dealId: string) => {
    setExpandedDealId(prevId => prevId === dealId ? null : dealId);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'accepted':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Accepted</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Declined</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Past Offers</h2>
        <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
          {deals.length} {deals.length === 1 ? 'offer' : 'offers'}
        </span>
      </div>
      
      <div className="space-y-3">
        {deals.length > 0 ? (
          deals.map((deal) => {
            const updatedDate = deal.updated_at ? new Date(deal.updated_at) : null;
            const formattedUpdatedDate = updatedDate ? format(updatedDate, 'MMM dd, yyyy') : 'Unknown date';
            
            return (
              <Card key={deal.id} className="border border-gray-200">
                <div
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleExpandDeal(deal.id)}
                >
                  <div className="flex items-center gap-3">
                    {deal.profiles.logo_url ? (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                        <img 
                          src={deal.profiles.logo_url} 
                          alt={deal.profiles.company_name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                        <span className="font-medium text-gray-500">
                          {deal.profiles.company_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{deal.title}</p>
                      <p className="text-sm text-muted-foreground">{deal.profiles.company_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(deal.status)}
                      <p className="font-semibold">${deal.value.toLocaleString()}</p>
                    </div>
                    {expandedDealId === deal.id ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {expandedDealId === deal.id && (
                  <CardContent className="pt-0 pb-4 border-t border-gray-100">
                    {deal.description && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">{deal.description}</p>
                      </div>
                    )}
                    
                    {deal.status === 'declined' && deal.feedback && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Your Feedback:</h4>
                        <p className="text-sm text-muted-foreground italic bg-gray-50 p-3 rounded-md">
                          "{deal.feedback}"
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-end text-sm text-muted-foreground mt-2">
                      <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                      {deal.status === 'accepted' ? 'Accepted on' : 
                       deal.status === 'declined' ? 'Declined on' : 
                       'Updated on'} {formattedUpdatedDate}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-muted-foreground"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="font-medium text-base mb-1">No past offers</h3>
              <p className="text-sm text-muted-foreground">
                After responding to offers, they'll appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default PastDeals;
