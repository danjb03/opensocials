
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
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CreditCard className="h-6 w-6" />
            Deal Lifecycle & Payment Flow
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Complete deal workflow from campaign creation to payment with bottleneck analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dealStages.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <Card className="border-l-4 border-l-purple-500 bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-full border border-purple-500/30">
                          <stage.icon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground">{stage.stage}</CardTitle>
                          <CardDescription className="text-muted-foreground">{stage.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant="outline" className="border-border text-foreground">{stage.duration}</Badge>
                        <Badge variant={stage.automation === 'High' ? 'default' : stage.automation === 'Medium' ? 'secondary' : 'destructive'} className="block">
                          {stage.automation} Automation
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-foreground">Database Tables</h4>
                        <div className="flex flex-wrap gap-1">
                          {stage.database.map((table) => (
                            <Badge key={table} variant="outline" className="text-xs font-mono border-border text-muted-foreground">
                              {table}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-red-400">Bottlenecks</h4>
                        <div className="space-y-1">
                          {stage.bottlenecks.map((bottleneck) => (
                            <div key={bottleneck} className="text-xs text-red-300 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
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
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <DollarSign className="h-5 w-5" />
              Payment Structure (25% Platform Margin)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">Gross Amount (Brand Pays)</span>
                  <span className="font-bold text-foreground">${paymentFlow.grossAmount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Platform Fee (25%)</span>
                  <span className="text-red-400">-${paymentFlow.platformFee}</span>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-2">
                  <span className="font-medium text-foreground">Net Amount (Creator Receives)</span>
                  <span className="font-bold text-green-400">${paymentFlow.netAmount}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Milestone Breakdown</h4>
                {paymentFlow.breakdown.map((milestone) => (
                  <div key={milestone.milestone} className="border border-border rounded-lg p-3 bg-muted/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm text-foreground">{milestone.milestone}</span>
                      <Badge variant="outline" className="border-border text-foreground">{milestone.percentage}%</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Gross: ${milestone.gross}</span>
                      <span className="text-green-400">Net: ${milestone.net}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Deal Success Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-3 text-foreground">Conversion Funnel</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Invitations Sent</span>
                    <Badge variant="outline" className="border-border text-foreground">100%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Creator Responses</span>
                    <Badge variant="secondary" className="border-border">78%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Deals Accepted</span>
                    <Badge variant="secondary" className="border-border">65%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Content Submitted</span>
                    <Badge variant="secondary" className="border-border">85%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payments Completed</span>
                    <Badge variant="default">92%</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-3 text-foreground">Average Timelines</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Invitation to Response</span>
                    <Badge variant="outline" className="border-border text-foreground">2.3 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Contract to Content</span>
                    <Badge variant="outline" className="border-border text-foreground">4.7 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Submit to Approval</span>
                    <Badge variant="outline" className="border-border text-foreground">1.2 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Approval to Payment</span>
                    <Badge variant="outline" className="border-border text-foreground">1.8 days</Badge>
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
