
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import LogoUploader from './LogoUploader';

interface ProfileFormProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  brandBio: string;
  setBrandBio: (value: string) => void;
  budgetRange: string;
  setBudgetRange: (value: string) => void;
  logoFile: File | null;
  logoPreview: string | null;
  logoUrl: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoFileSelect: (file: File) => void;
  onClearLogo: () => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSkip: () => void;
  industries: string[];
  budgetRanges: string[];
}

const ProfileForm = ({
  companyName,
  setCompanyName,
  website,
  setWebsite,
  industry,
  setIndustry,
  brandBio,
  setBrandBio,
  budgetRange,
  setBudgetRange,
  logoPreview,
  logoUrl,
  onLogoChange,
  onLogoFileSelect,
  onClearLogo,
  isLoading,
  onSubmit,
  onSkip,
  industries,
  budgetRanges
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-sm sm:text-base">Company Name *</Label>
        <Input 
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Your company name"
          required
          className="h-10 sm:h-11 text-sm sm:text-base"
        />
      </div>
      
      <LogoUploader
        logoPreview={logoPreview}
        logoUrl={logoUrl}
        onLogoChange={onLogoChange}
        onLogoFileSelect={onLogoFileSelect}
        onClearLogo={onClearLogo}
      />
      
      <div className="space-y-2">
        <Label htmlFor="website" className="text-sm sm:text-base">Website</Label>
        <Input 
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://your-company.com"
          className="h-10 sm:h-11 text-sm sm:text-base"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="industry" className="text-sm sm:text-base">Industry</Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind} className="text-sm sm:text-base">
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budgetRange" className="text-sm sm:text-base">Budget Range</Label>
        <Select value={budgetRange} onValueChange={setBudgetRange}>
          <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
            <SelectValue placeholder="Select budget range" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {budgetRanges.map((range) => (
              <SelectItem key={range} value={range} className="text-sm sm:text-base">
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brandBio" className="text-sm sm:text-base">Brand Bio</Label>
        <Textarea 
          id="brandBio"
          value={brandBio}
          onChange={(e) => setBrandBio(e.target.value)}
          placeholder="Tell us about your brand..."
          rows={4}
          className="text-sm sm:text-base resize-none"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          className="flex items-center justify-center gap-2 h-10 sm:h-11 text-sm sm:text-base order-2 sm:order-1"
          disabled={isLoading}
        >
          <ArrowLeft size={16} className="hidden sm:inline" />
          Skip for now
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="h-10 sm:h-11 text-sm sm:text-base order-1 sm:order-2"
        >
          {isLoading ? 'Saving...' : 'Complete Setup'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
