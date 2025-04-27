
import { useUserRole } from '@/hooks/useUserRole';

interface RoleDisplayProps {
  userId: string;
}

export const RoleDisplay = ({ userId }: RoleDisplayProps) => {
  const { role, status, isLoading } = useUserRole(userId);

  if (isLoading) {
    return <div>Loading role...</div>;
  }

  if (!role) {
    return (
      <div>
        {status === 'pending' ? (
          <p>Your account is pending approval</p>
        ) : (
          <p>No role assigned</p>
        )}
      </div>
    );
  }

  return <div>Your role: {role}</div>;
};
