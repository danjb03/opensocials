
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
    <div className="bg-card border border-border rounded-lg p-8">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email" className="text-white text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 bg-black border-border text-white placeholder:text-muted-foreground focus:border-white"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-white text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-2 bg-black border-border text-white placeholder:text-muted-foreground focus:border-white"
            placeholder="Enter your password"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-white text-black hover:bg-gray-200 font-medium py-3" 
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
        
        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="link"
            onClick={onToggleMode}
            className="text-muted-foreground hover:text-white text-sm p-0"
          >
            Need an account?
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={onForgotPassword}
            className="text-muted-foreground hover:text-white text-sm p-0"
          >
            Forgot password?
          </Button>
        </div>
      </form>
    </div>
  );
};
