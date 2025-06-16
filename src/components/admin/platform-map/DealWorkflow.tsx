
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ArrowRight, DollarSign, FileText, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DealWorkflow() {
  const dealStages = [
    {
      stage: "Campaign Creation",
      icon: FileText,
      duration: "5-7 minutes",
      automation: "High",
      bottlenecks: ["Budget validation complexity", "Creator selection UI"],
      database: ["projects_new", "project_drafts"],
      description: "Brand creates campaign with budget, requirements, and creator targets"
    },
    {
      stage: "Creator Invitation",
      icon: ArrowRight,
      duration: "1-2 minutes",
      automation: "High",
      bottlenecks: ["Bulk invitation limitations"],
      database: ["project_creators", "brand_creator_connections"],
      description: "System sends invitations to selected creators with individual budgets"
    },
    {
      stage: "Creator Response",
      icon: CheckCircle,
      duration: "24-72 hours",
      automation: "Manual",
      bottlenecks: ["Response tracking", "Negotiation flow"],
      database: ["project_creators.status", "creator_deals"],
      description: "Creators accept/decline with optional counter-offers"
    },
    {
      stage: "Contract Generation",
      icon: FileText,
      duration: "5-10 minutes",
      automation: "Medium",
      bottlenecks: ["External PDF process", "E-signature integration"],
      database: ["project_creators.contract_signed_date"],
      description: "Legal agreements generated and signed by both parties"
    },
    {
      stage: "Content Creation",
      icon: Clock,
      duration: "1-7 days",
      automation: "External",
      bottlenecks: ["No platform tracking", "Deadline management"],
      database: ["project_content"],
      description: "Creator produces content according to brief specifications"
    },
    {
      stage: "Content Review",
      icon: CheckCircle,
      duration: "2-5 minutes",
      automation: "Medium",
      bottlenecks: ["Manual approval process", "Feedback loops"],
      database: ["project_content.status", "campaign_reviews"],
      description: "Brand reviews and approves/rejects submitted content"
    },
    {
      stage: "Payment Processing",
      icon: DollarSign,
      duration: "24-48 hours",
      automation: "Low",
      bottlenecks: ["Manual payment triggers", "Platform fee calculation"],
      database: ["project_creator_payments", "deal_earnings"],
      description: "Milestone-based payments with 25% platform margin"
    }
  ];

  const paymentFlow = {
    grossAmount: 1000,
    platformFee: 250,
    netAmount: 750,
    breakdown: [
      { milestone: "Contract Signing", percentage: 20, gross: 200, net: 150 },
      { milestone: "Content Submission", percentage: 30, gross: 300, net: 225 },
      { milestone: "Content Approval", percentage: 50, gross: 500, net: 375 }
    ]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Deal Lifecycle & Payment Flow
          </CardTitle>
          <CardDescription>
            Complete deal workflow from campaign creation to payment with bottleneck analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dealStages.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                          <stage.icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{stage.stage}</CardTitle>
                          <CardDescription>{stage.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant="outline">{stage.duration}</Badge>
                        <Badge variant={stage.automation === 'High' ? 'default' : stage.automation === 'Medium' ? 'secondary' : 'destructive'}>
                          {stage.automation} Automation
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Database Tables</h4>
                        <div className="flex flex-wrap gap-1">
                          {stage.database.map((table) => (
                            <Badge key={table} variant="outline" className="text-xs font-mono">
                              {table}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-red-600">Bottlenecks</h4>
                        <div className="space-y-1">
                          {stage.bottlenecks.map((bottleneck) => (
                            <div key={bottleneck} className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded">
                              {bottleneck}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {index < dealStages.length - 1 && (
                  <div className="flex justify-center my-4">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Structure (25% Platform Margin)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Gross Amount (Brand Pays)</span>
                  <span className="font-bold">${paymentFlow.grossAmount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Platform Fee (25%)</span>
                  <span className="text-red-600">-${paymentFlow.platformFee}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-medium">Net Amount (Creator Receives)</span>
                  <span className="font-bold text-green-600">${paymentFlow.netAmount}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Milestone Breakdown</h4>
                {paymentFlow.breakdown.map((milestone) => (
                  <div key={milestone.milestone} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{milestone.milestone}</span>
                      <Badge variant="outline">{milestone.percentage}%</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Gross: ${milestone.gross}</span>
                      <span className="text-green-600">Net: ${milestone.net}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Success Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-3">Conversion Funnel</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Invitations Sent</span>
                    <Badge variant="outline">100%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Creator Responses</span>
                    <Badge variant="secondary">78%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Deals Accepted</span>
                    <Badge variant="secondary">65%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Content Submitted</span>
                    <Badge variant="secondary">85%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payments Completed</span>
                    <Badge variant="default">92%</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-3">Average Timelines</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Invitation to Response</span>
                    <Badge variant="outline">2.3 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Contract to Content</span>
                    <Badge variant="outline">4.7 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Submit to Approval</span>
                    <Badge variant="outline">1.2 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Approval to Payment</span>
                    <Badge variant="outline">1.8 days</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
