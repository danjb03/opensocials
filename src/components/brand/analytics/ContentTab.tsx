
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ContentPerformanceItem } from './ContentPerformanceItem';

export const ContentTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Performance</CardTitle>
        <CardDescription>Compare performance across different content pieces</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ContentPerformanceItem 
            title="Campaign Launch Post"
            creator="@emmacreates"
            date="May 2nd"
            platform="Instagram Post"
            stats={{
              Likes: 2451,
              Comments: 348,
              Shares: 123,
              Saves: 287
            }}
            progressLabel="Engagement Rate"
            progressValue={5.8}
          />
          
          <ContentPerformanceItem 
            title="Product Feature Video"
            creator="@alexlifestyle" 
            date="May 3rd"
            platform="TikTok Video"
            stats={{
              Views: 45287,
              Likes: 8192,
              Comments: 1248,
              Shares: 3541
            }}
            progressLabel="Watch Completion"
            progressValue={72}
          />
        </div>
      </CardContent>
    </Card>
  );
};
