
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { Badge } from '@/components/ui/badge';

interface RoleDisplayProps {
  userId?: string; // Made optional since unified auth uses current user
}

export const RoleDisplay = ({ userId }: RoleDisplayProps) => {
  const { role, isLoading } = useUnifiedAuth();
  const error = null; // Unified auth handles errors internally

  if (isLoading) {
    return <div>Loading role...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!role) {
    return <div className="text-amber-500">No role assigned</div>;
  }

  const getBadgeVariant = (userRole: string) => {
    switch (userRole) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'outline';
      case 'brand': return 'secondary';
      case 'creator': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Badge variant={getBadgeVariant(role)}>
      {role === 'super_admin' ? 'Super Admin' : 
       role === 'admin' ? 'Admin' : 
       role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  );
};
