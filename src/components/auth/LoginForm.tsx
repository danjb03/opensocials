
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onSubmit,
  onToggleMode,
  onForgotPassword,
}: LoginFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
          Need an account?
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={onForgotPassword}
          className="text-sm"
        >
          Forgot password?
        </Button>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign In'}
      </Button>
    </form>
  );
};
