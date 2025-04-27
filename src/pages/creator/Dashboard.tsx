import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingUp, Users } from 'lucide-react';

const CreatorDashboard = () => {
  const { user } = useAuth();
  
  const { data: earnings } = useQuery({
    queryKey: ['creator-earnings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deal_earnings')
        .select('amount, earned_at')
        .eq('creator_id', user?.id)
        .order('earned_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: connections } = useQuery({
    queryKey: ['creator-connections', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_creator_connections')
        .select('status')
        .eq('creator_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: deals } = useQuery({
    queryKey: ['creator-deals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('value, status')
        .eq('creator_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const totalEarnings = earnings?.reduce((sum, earning) => sum + earning.amount, 0) || 0;
  const pipelineValue = deals
    ?.filter(deal => deal.status === 'pending')
    .reduce((sum, deal) => sum + deal.value, 0) || 0;
    
  const connectionStats = {
    outreach: connections?.filter(c => c.status === 'outreach').length || 0,
    in_talks: connections?.filter(c => c.status === 'in_talks').length || 0,
    working: connections?.filter(c => c.status === 'working').length || 0,
  };

  const earningsData = earnings?.map(earning => ({
    date: new Date(earning.earned_at).toLocaleDateString(),
    amount: earning.amount,
  })) || [];

  return (
    <CreatorLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Creator Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Lifetime earnings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Pipeline Value</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${pipelineValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">In pending deals</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Brand Connections</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{
                connectionStats.outreach + connectionStats.in_talks + connectionStats.working
              }</div>
              <p className="text-sm text-muted-foreground">
                {connectionStats.working} active collaborations
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Earnings Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </CreatorLayout>
  );
};

export default CreatorDashboard;
