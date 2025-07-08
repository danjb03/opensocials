
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCreatorAuth } from '@/hooks/useUnifiedAuth';

export const AnalyticsDebugger: React.FC = () => {
  const { user } = useCreatorAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testAPI = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Check what's in the database
      const { data: dbData, error: dbError } = await supabase
        .from('creator_public_analytics')
        .select('*')
        .eq('creator_id', user.id);

      console.log('Database data:', dbData);
      console.log('Database error:', dbError);

      setResult({
        database: {
          data: dbData,
          error: dbError
        }
      });
    } catch (error) {
      console.error('Test failed:', error);
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Analytics Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testAPI}
          disabled={isLoading || !user?.id}
          size="sm"
          variant="outline"
          className="mb-4"
        >
          {isLoading ? 'Testing...' : 'Test Analytics Data'}
        </Button>
        
        {result && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2 text-foreground">Results:</h4>
            <pre className="text-xs bg-muted text-foreground p-4 rounded border border-border overflow-auto max-h-96 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
