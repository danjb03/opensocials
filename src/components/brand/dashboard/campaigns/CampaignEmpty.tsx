
import { FileEdit } from 'lucide-react';

export function CampaignEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-slate-100 p-4 mb-4">
        <FileEdit className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-800 mb-2">No campaigns yet</h3>
      <p className="text-center text-slate-500 mb-6 max-w-md">
        Create your first marketing campaign to start working with creators
      </p>
    </div>
  );
}
