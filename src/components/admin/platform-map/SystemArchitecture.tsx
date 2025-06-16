
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Database, Globe, Shield, Zap, Users, FileText, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SystemArchitecture() {
  const architectureComponents = [
    {
      name: "Frontend (React/Vite)",
      icon: Globe,
      description: "Multi-role SPA with brand, creator, admin interfaces",
      status: "operational",
      connections: ["Supabase", "Authentication", "Edge Functions"],
      bottlenecks: ["Bundle size", "Route complexity"]
    },
    {
      name: "Supabase Database",
      icon: Database,
      description: "PostgreSQL with RLS, real-time subscriptions",
      status: "operational",
      connections: ["Frontend", "Edge Functions", "Authentication"],
      bottlenecks: ["Complex queries", "RLS performance"]
    },
    {
      name: "Edge Functions",
      icon: Server,
      description: "Server-side logic, email, integrations",
      status: "operational",
      connections: ["Database", "External APIs", "Frontend"],
      bottlenecks: ["Cold starts", "Function complexity"]
    },
    {
      name: "Authentication (Supabase Auth)",
      icon: Shield,
      description: "Role-based access control, email confirmation",
      status: "operational",
      connections: ["Frontend", "Database", "User Management"],
      bottlenecks: ["Role resolution hierarchy", "Profile completion flow"]
    },
    {
      name: "External Integrations",
      icon: Zap,
      description: "InsightIQ, Resend, Stripe, Social Media APIs",
      status: "operational",
      connections: ["Edge Functions", "Creator Profiles", "Payments"],
      bottlenecks: ["API rate limits", "Data sync delays"]
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">System Overview</CardTitle>
          <CardDescription className="text-gray-300">
            High-level architecture showing major components and their interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {architectureComponents.map((component) => (
              <Card key={component.name} className="border-l-4 border-l-blue-500 bg-gray-800 border-gray-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <component.icon className="h-6 w-6 text-blue-400" />
                    <Badge variant={component.status === 'operational' ? 'default' : 'destructive'} className="bg-green-600 text-white border-green-500">
                      {component.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-white">{component.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-300">
                    {component.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-white">Connections</h4>
                    <div className="flex flex-wrap gap-1">
                      {component.connections.map((conn) => (
                        <Badge key={conn} variant="outline" className="text-xs bg-gray-700 text-gray-200 border-gray-600">
                          {conn}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-orange-400">Bottlenecks</h4>
                    <div className="flex flex-wrap gap-1">
                      {component.bottlenecks.map((bottleneck) => (
                        <Badge key={bottleneck} variant="secondary" className="text-xs bg-orange-900/30 text-orange-300 border-orange-500/30">
                          {bottleneck}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5" />
              User Roles & Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <span className="font-medium text-white">Super Admin</span>
                <Badge variant="default" className="bg-blue-600 text-white border-blue-500">Full Access</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                <span className="font-medium text-white">Admin</span>
                <Badge variant="secondary" className="bg-green-700 text-white border-green-600">CRM + Platform Management</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <span className="font-medium text-white">Brand</span>
                <Badge variant="outline" className="bg-gray-700 text-gray-200 border-gray-600">Campaign Creation + Creator Search</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-900/30 rounded-lg border border-orange-500/30">
                <span className="font-medium text-white">Creator</span>
                <Badge variant="outline" className="bg-gray-700 text-gray-200 border-gray-600">Profile + Content Submission</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              Key Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Campaign Creation Time</span>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200 border-gray-600">~5 minutes</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Creator Onboarding</span>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200 border-gray-600">~10 minutes</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Deal Processing</span>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200 border-gray-600">Real-time</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Payment Processing</span>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200 border-gray-600">24-48 hours</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Analytics Refresh</span>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200 border-gray-600">Daily</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
