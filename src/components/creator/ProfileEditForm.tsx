
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { industries } from '@/data/industries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  bio: z.string().max(500, { message: 'Bio must be 500 characters or less' }),
  primaryPlatform: z.string().min(1, { message: 'Primary platform is required' }),
  contentType: z.string().min(1, { message: 'Content type is required' }),
  audience: z.string().min(1, { message: 'Target audience is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  industries: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditFormProps {
  initialValues: Partial<ProfileFormValues>;
  avatarUrl?: string;
  onSubmit: (values: ProfileFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onAvatarChange?: (file: File) => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  initialValues,
  avatarUrl,
  onSubmit,
  onCancel,
  isLoading = false,
  onAvatarChange
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedIndustries, setSelectedIndustries] = React.useState<string[]>(initialValues.industries || []);
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: initialValues.firstName || '',
      lastName: initialValues.lastName || '',
      bio: initialValues.bio || '',
      primaryPlatform: initialValues.primaryPlatform || '',
      contentType: initialValues.contentType || '',
      audience: initialValues.audience || '',
      location: initialValues.location || '',
      industries: initialValues.industries || [],
    }
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  const handleFormSubmit = (values: ProfileFormValues) => {
    console.log('Form submitted with values:', values);
    // Ensure the industries are included in the form submission
    values.industries = selectedIndustries;
    onSubmit(values);
  };

  const handleIndustrySelect = (industry: string) => {
    setSelectedIndustries(current => 
      current.includes(industry) 
        ? current.filter(i => i !== industry)
        : [...current, industry]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Avatar 
                className="w-24 h-24 cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary"
                onClick={handleAvatarClick}
              >
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  {form.watch('firstName')?.[0]}{form.watch('lastName')?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button 
                type="button" 
                variant="link" 
                size="sm"
                onClick={handleAvatarClick}
              >
                Change Profile Picture
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Industries</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-start font-normal"
                  >
                    {selectedIndustries.length > 0
                      ? `${selectedIndustries.length} industries selected`
                      : "Select your industries..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search industries..." />
                    <CommandEmpty>No industry found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {industries.map((industry) => (
                        <CommandItem
                          key={industry}
                          value={industry}
                          onSelect={() => handleIndustrySelect(industry)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedIndustries.includes(industry) ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {industry}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedIndustries.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedIndustries.map((industry) => (
                    <Badge key={industry} variant="secondary">
                      {industry}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="primaryPlatform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Platform</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="photo">Photo</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gen-z">Gen Z</SelectItem>
                        <SelectItem value="millennials">Millennials</SelectItem>
                        <SelectItem value="gen-x">Gen X</SelectItem>
                        <SelectItem value="boomers">Boomers</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
