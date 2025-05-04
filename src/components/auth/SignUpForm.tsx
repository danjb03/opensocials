
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserRole } from '@/lib/auth';

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
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="creator">Creator</option>
          <option value="brand">Brand</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="link"
          onClick={onToggleMode}
          className="text-sm"
        >
          Already have an account?
        </Button>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign Up'}
      </Button>
    </form>
  );
};
