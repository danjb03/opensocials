
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/lib/auth';
import { Loader } from 'lucide-react';

interface SignUpFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  role: UserRole;
  setRole: (value: UserRole) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onToggleMode: () => void;
}

export const SignUpForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  isLoading,
  onSubmit,
  onToggleMode,
}: SignUpFormProps) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div>
        <Label htmlFor="firstName" className="text-white">First Name *</Label>
        <Input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
          placeholder="Enter your first name"
        />
      </div>
      <div>
        <Label htmlFor="lastName" className="text-white">Last Name *</Label>
        <Input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
          placeholder="Enter your last name"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-white">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
          placeholder="Enter your email address"
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-white">Password *</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
          placeholder="Create a secure password (min 8 characters)"
        />
        <p className="text-xs text-gray-400 mt-1">
          Password must be at least 8 characters with uppercase, lowercase, and numbers
        </p>
      </div>
      <div>
        <Label htmlFor="role" className="text-white">I am a *</Label>
        <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
          <SelectTrigger id="role" className="w-full bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="creator" className="text-white hover:bg-gray-800">Creator</SelectItem>
            <SelectItem value="brand" className="text-white hover:bg-gray-800">Brand</SelectItem>
            <SelectItem value="agency" className="text-white hover:bg-gray-800">Agency</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="link"
          onClick={onToggleMode}
          className="text-sm text-gray-400 hover:text-white"
        >
          Already have an account? Sign in
        </Button>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-white text-black hover:bg-gray-200 font-medium" 
        disabled={isLoading || !firstName.trim() || !lastName.trim() || !email.trim() || !password || !role}
      >
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};
