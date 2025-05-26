
import { useState } from 'react';
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
  onClearLogo,
  isLoading,
  onSubmit,
  onSkip,
  industries,
  budgetRanges
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Input 
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Your company name"
          required
        />
      </div>
      
      <LogoUploader
        logoPreview={logoPreview}
        logoUrl={logoUrl}
        onLogoChange={onLogoChange}
        onClearLogo={onClearLogo}
      />
      
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input 
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://your-company.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger>
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budgetRange">Budget Range</Label>
        <Select value={budgetRange} onValueChange={setBudgetRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select budget range" />
          </SelectTrigger>
          <SelectContent>
            {budgetRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brandBio">Brand Bio</Label>
        <Textarea 
          id="brandBio"
          value={brandBio}
          onChange={(e) => setBrandBio(e.target.value)}
          placeholder="Tell us about your brand..."
          rows={3}
        />
      </div>
      
      <div className="pt-4 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <ArrowLeft size={16} /> Skip for now
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Complete Setup'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
