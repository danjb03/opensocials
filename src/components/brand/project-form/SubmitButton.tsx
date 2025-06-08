
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isValid?: boolean;
}

export function SubmitButton({ isSubmitting, isValid = true }: SubmitButtonProps) {
  return (
    <div className="flex justify-end pt-4">
      <Button 
        type="submit" 
        disabled={isSubmitting || !isValid}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin h-4 w-4" />
            Creating...
          </span>
        ) : (
          <span className="flex items-center gap-2 group">
            <Check className="h-5 w-5 transition-transform group-hover:scale-110" />
            Create Campaign
          </span>
        )}
      </Button>
    </div>
  );
}
