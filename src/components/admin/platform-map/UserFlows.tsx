
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ArrowRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function UserFlows() {
  const userFlows = [
    {
      role: "Brand",
      color: "blue",
      steps: [
        { name: "Sign Up", status: "optimized", time: "2 min", issues: [] },
        { name: "Profile Setup", status: "bottleneck", time: "5-10 min", issues: ["Logo upload UX", "Industry selection complexity"] },
        { name: "Campaign Creation", status: "optimized", time: "5-7 min", issues: [] },
        { name: "Creator Search", status: "good", time: "3-5 min", issues: ["Filter performance"] },
        { name: "Creator Invitation", status: "optimized", time: "1 min", issues: [] },
        { name: "Content Review", status: "good", time: "2-5 min", issues: ["Bulk operations missing"] },
        { name: "Payment Processing", status: "manual", time: "24-48 hrs", issues: ["Manual intervention required"] }
      ]
    },
    {
      role: "Creator",
      color: "green",
      steps: [
        { name: "Sign Up", status: "optimized", time: "2 min", issues: [] },
        { name: "Profile Setup", status: "bottleneck", time: "10-15 min", issues: ["Social verification complexity", "Analytics integration delays"] },
        { name: "Invitation Response", status: "good", time: "2-3 min", issues: [] },
        { name: "Contract Signing", status: "manual", time: "5-10 min", issues: ["External PDF process"] },
        { name: "Content Creation", status: "external", time: "1-7 days", issues: ["No tracking"] },
        { name: "Content Submission", status: "good", time: "3-5 min", issues: ["File size limits"] },
        { name: "Payment Receipt", status: "good", time: "24-48 hrs", issues: ["Payment visibility"] }
      ]
    },
    {
      role: "Admin",
      color: "purple",
      steps: [
        { name: "User Management", status: "optimized", time: "1-2 min", issues: [] },
        { name: "Campaign Review", status: "bottleneck", time: "10-20 min", issues: ["Manual review process", "AI accuracy issues"] },
        { name: "CRM Operations", status: "good", time: "2-5 min", issues: ["Data export limitations"] },
        { name: "Analytics Review", status: "manual", time: "30-60 min", issues: ["Scattered metrics", "No unified dashboard"] },
        { name: "Platform Monitoring", status: "basic", time: "15-30 min", issues: ["Limited observability", "No automated alerts"] }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimized': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case 'bottleneck': return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'manual': return <Clock className="h-4 w-4 text-orange-400" />;
      case 'basic': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'external': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'bottleneck': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'manual': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'basic': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'external': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Brand': return 'border-blue-500';
      case 'Creator': return 'border-green-500';
      case 'Admin': return 'border-purple-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-6 w-6" />
            User Journey Analysis
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            End-to-end user flows with bottleneck identification and optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8">
            {userFlows.map((flow) => (
              <Card key={flow.role} className={`border-l-4 ${getRoleColor(flow.role)} bg-card`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <div className={`h-3 w-3 rounded-full ${flow.color === 'blue' ? 'bg-blue-500' : flow.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                    {flow.role} Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flow.steps.map((step, index) => (
                      <div key={step.name} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {getStatusIcon(step.status)}
                          <span className="font-medium text-foreground">{step.name}</span>
                          <Badge variant="outline" className="text-xs border-border">
                            {step.time}
                          </Badge>
                          <Badge className={`text-xs border ${getStatusColor(step.status)}`}>
                            {step.status}
                          </Badge>
                        </div>
                        {index < flow.steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    ))}
                    
                    {/* Issues Summary */}
                    <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
                      <h4 className="font-medium text-sm mb-2 text-foreground">Key Issues & Bottlenecks</h4>
                      <div className="space-y-1">
                        {flow.steps
                          .filter(step => step.issues.length > 0)
                          .map(step => (
                            <div key={step.name} className="text-sm">
                              <span className="font-medium text-foreground">{step.name}:</span>
                              <span className="text-muted-foreground ml-2">
                                {step.issues.join(', ')}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Optimization Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 rounded-lg border-l-4 border-l-red-500">
                <h4 className="font-medium text-red-300">High Priority</h4>
                <ul className="text-sm text-red-200 mt-1 space-y-1">
                  <li>• Creator profile setup flow</li>
                  <li>• Campaign review automation</li>
                  <li>• Payment processing</li>
                </ul>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg border-l-4 border-l-orange-500">
                <h4 className="font-medium text-orange-300">Medium Priority</h4>
                <ul className="text-sm text-orange-200 mt-1 space-y-1">
                  <li>• Brand profile onboarding</li>
                  <li>• Content review bulk operations</li>
                  <li>• Analytics dashboard</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Flow Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Brand Onboarding</span>
                <Badge variant="secondary" className="border-border">12-17 min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Creator Onboarding</span>
                <Badge variant="secondary" className="border-border">15-25 min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Campaign Launch Time</span>
                <Badge variant="secondary" className="border-border">1-3 days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Deal Completion Rate</span>
                <Badge variant="secondary" className="border-border">73%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Automation Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-2 bg-blue-500/10 rounded text-sm border border-blue-500/20">
                <strong className="text-blue-300">Social Verification:</strong> 
                <span className="text-blue-200 ml-1">Auto-verify social handles via API</span>
              </div>
              <div className="p-2 bg-blue-500/10 rounded text-sm border border-blue-500/20">
                <strong className="text-blue-300">Campaign Review:</strong> 
                <span className="text-blue-200 ml-1">Enhanced AI review with auto-approval</span>
              </div>
              <div className="p-2 bg-blue-500/10 rounded text-sm border border-blue-500/20">
                <strong className="text-blue-300">Payment Processing:</strong> 
                <span className="text-blue-200 ml-1">Automated milestone payments</span>
              </div>
              <div className="p-2 bg-blue-500/10 rounded text-sm border border-blue-500/20">
                <strong className="text-blue-300">Content Tracking:</strong> 
                <span className="text-blue-200 ml-1">Integration with creator tools</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
