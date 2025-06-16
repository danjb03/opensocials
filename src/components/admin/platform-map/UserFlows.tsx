
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
      case 'optimized': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'bottleneck': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'manual': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'basic': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'external': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'bottleneck': return 'bg-red-100 text-red-800';
      case 'manual': return 'bg-orange-100 text-orange-800';
      case 'basic': return 'bg-yellow-100 text-yellow-800';
      case 'external': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Journey Analysis
          </CardTitle>
          <CardDescription>
            End-to-end user flows with bottleneck identification and optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8">
            {userFlows.map((flow) => (
              <Card key={flow.role} className={`border-l-4 border-l-${flow.color}-500`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-${flow.color}-500`}></div>
                    {flow.role} Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flow.steps.map((step, index) => (
                      <div key={step.name} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {getStatusIcon(step.status)}
                          <span className="font-medium">{step.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {step.time}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(step.status)}`}>
                            {step.status}
                          </Badge>
                        </div>
                        {index < flow.steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                    
                    {/* Issues Summary */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Key Issues & Bottlenecks</h4>
                      <div className="space-y-1">
                        {flow.steps
                          .filter(step => step.issues.length > 0)
                          .map(step => (
                            <div key={step.name} className="text-sm">
                              <span className="font-medium">{step.name}:</span>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optimization Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                <h4 className="font-medium text-red-900">High Priority</h4>
                <ul className="text-sm text-red-700 mt-1 space-y-1">
                  <li>• Creator profile setup flow</li>
                  <li>• Campaign review automation</li>
                  <li>• Payment processing</li>
                </ul>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-l-orange-500">
                <h4 className="font-medium text-orange-900">Medium Priority</h4>
                <ul className="text-sm text-orange-700 mt-1 space-y-1">
                  <li>• Brand profile onboarding</li>
                  <li>• Content review bulk operations</li>
                  <li>• Analytics dashboard</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Flow Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Brand Onboarding</span>
                <Badge variant="secondary">12-17 min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Creator Onboarding</span>
                <Badge variant="secondary">15-25 min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Campaign Launch Time</span>
                <Badge variant="secondary">1-3 days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Deal Completion Rate</span>
                <Badge variant="secondary">73%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Automation Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-2 bg-blue-50 rounded text-sm">
                <strong>Social Verification:</strong> Auto-verify social handles via API
              </div>
              <div className="p-2 bg-blue-50 rounded text-sm">
                <strong>Campaign Review:</strong> Enhanced AI review with auto-approval
              </div>
              <div className="p-2 bg-blue-50 rounded text-sm">
                <strong>Payment Processing:</strong> Automated milestone payments
              </div>
              <div className="p-2 bg-blue-50 rounded text-sm">
                <strong>Content Tracking:</strong> Integration with creator tools
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
