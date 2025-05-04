
import { useUserRole } from '@/hooks/useUserRole';

interface RoleDisplayProps {
  userId: string;
}

export const RoleDisplay = ({ userId }: RoleDisplayProps) => {
  const { role, isLoading, error } = useUserRole(userId);

  if (isLoading) {
    return <div>Loading role...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!role) {
    return <div>No role assigned</div>;
  }

  return <div>Your role: {role}</div>;
};
