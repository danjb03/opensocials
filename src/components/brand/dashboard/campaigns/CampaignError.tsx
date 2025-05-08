
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CampaignErrorProps {
  error: string;
  onRetry: () => void;
}

export function CampaignError({ error, onRetry }: CampaignErrorProps) {
  return (
    <div className="p-6 border border-red-200 bg-red-50 rounded-lg text-red-700">
      <h3 className="font-medium text-lg">Error loading campaigns</h3>
      <p className="text-sm mt-2">{error}</p>
      <Button variant="outline" className="mt-4 border-red-300" onClick={onRetry}>
        <Clock className="mr-2 h-4 w-4" /> Try Again
      </Button>
    </div>
  );
}
