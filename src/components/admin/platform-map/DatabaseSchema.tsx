
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Link, Users, FileText, CreditCard, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DatabaseSchema() {
  const coreTableGroups = [
    {
      name: "User Management",
      icon: Users,
      tables: [
        { name: "profiles", description: "Core user profiles with role fallback", records: "~500" },
        { name: "user_roles", description: "Primary role management with approval", records: "~500" },
        { name: "brand_profiles", description: "Brand-specific information", records: "~150" },
        { name: "creator_profiles", description: "Creator social profiles & analytics", records: "~300" }
      ],
      relationships: "1:1 with auth.users, 1:many roles"
    },
    {
      name: "Campaign System",
      icon: FileText,
      tables: [
        { name: "projects_new", description: "New campaign system with wizard", records: "~100" },
        { name: "projects", description: "Legacy campaign system", records: "~50" },
        { name: "project_drafts", description: "Campaign draft auto-save", records: "~25" },
        { name: "campaign_reviews", description: "AI-powered campaign review", records: "~75" }
      ],
      relationships: "Belongs to brands, contains multiple creators"
    },
    {
      name: "Creator Relations",
      icon: Link,
      tables: [
        { name: "project_creators", description: "Campaign-creator relationships", records: "~200" },
        { name: "creator_deals", description: "Individual creator agreements", records: "~150" },
        { name: "brand_creator_connections", description: "Brand-creator invitations", records: "~300" },
        { name: "project_content", description: "Content submissions & reviews", records: "~100" }
      ],
      relationships: "Junction tables linking brands, creators, campaigns"
    },
    {
      name: "Payment System",
      icon: CreditCard,
      tables: [
        { name: "project_creator_payments", description: "Milestone-based payments", records: "~50" },
        { name: "deal_earnings", description: "Creator earnings tracking", records: "~100" },
        { name: "pricing_floors", description: "Minimum pricing by tier", records: "~20" },
        { name: "deals", description: "Legacy deal system", records: "~75" }
      ],
      relationships: "25% platform margin, gross/net separation"
    },
    {
      name: "Security & Audit",
      icon: Shield,
      tables: [
        { name: "security_audit_log", description: "Security and action tracking", records: "~1000" },
        { name: "r4_rules", description: "Business rule enforcement", records: "~10" },
        { name: "r4_flags", description: "Feature flags for A/B testing", records: "~15" },
        { name: "rate_limits", description: "API rate limiting", records: "~50" }
      ],
      relationships: "Cross-cutting security and monitoring"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Database Architecture Overview
          </CardTitle>
          <CardDescription>
            PostgreSQL via Supabase with Row Level Security and real-time subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {coreTableGroups.map((group) => (
              <Card key={group.name} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <group.icon className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {group.relationships}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {group.tables.map((table) => (
                      <div key={table.name} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-mono text-sm font-medium">{table.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {table.records}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{table.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Database Bottlenecks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                <h4 className="font-medium text-red-900">Complex RLS Policies</h4>
                <p className="text-sm text-red-700">Role resolution checks impact query performance</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-l-orange-500">
                <h4 className="font-medium text-orange-900">Multiple Creator Tables</h4>
                <p className="text-sm text-orange-700">creator_profiles vs profiles duplication</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                <h4 className="font-medium text-yellow-900">Legacy vs New Systems</h4>
                <p className="text-sm text-yellow-700">projects vs projects_new parallel systems</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                <h4 className="font-medium text-green-900">Indexed Relationships</h4>
                <p className="text-sm text-green-700">Foreign keys and user_id columns indexed</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                <h4 className="font-medium text-blue-900">View Materialization</h4>
                <p className="text-sm text-blue-700">admin_crm_* views for complex aggregations</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
                <h4 className="font-medium text-purple-900">JSONB Usage</h4>
                <p className="text-sm text-purple-700">Flexible schemas for content requirements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
