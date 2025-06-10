
import { Progress } from '@/components/ui/progress';

interface ContentPerformanceItemProps {
  title: string;
  creator: string;
  date: string;
  platform: string;
  stats: {
    [key: string]: number | string;
  };
  progressLabel: string;
  progressValue: number;
}

export const ContentPerformanceItem = ({
  title,
  creator,
  date,
  platform,
  stats,
  progressLabel,
  progressValue
}: ContentPerformanceItemProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-card p-4 flex items-center justify-center md:border-r">
          <div className="aspect-video bg-muted rounded flex items-center justify-center w-full max-w-xs">
            <span className="text-foreground">{platform}</span>
          </div>
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="mb-4">
            <h3 className="font-medium text-foreground">{title}</h3>
            <p className="text-sm text-foreground mt-1">Posted by {creator} on {date}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm text-foreground">{key}</p>
                <p className="text-xl font-medium text-foreground">{value.toLocaleString()}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-foreground">{progressLabel}</p>
            <div className="flex items-center space-x-2">
              <Progress value={progressValue} className="h-2" />
              <span className="text-sm font-medium text-foreground">{progressValue}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
