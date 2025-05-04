
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
        <div className="md:w-1/3 bg-gray-100 p-4 flex items-center justify-center md:border-r">
          <div className="aspect-video bg-gray-200 rounded flex items-center justify-center w-full max-w-xs">
            <span className="text-gray-400">{platform}</span>
          </div>
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="mb-4">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">Posted by {creator} on {date}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm text-gray-500">{key}</p>
                <p className="text-xl font-medium">{value.toLocaleString()}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{progressLabel}</p>
            <div className="flex items-center space-x-2">
              <Progress value={progressValue} className="h-2" />
              <span className="text-sm font-medium">{progressValue}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
