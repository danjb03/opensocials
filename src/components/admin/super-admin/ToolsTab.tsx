
import UserRoleFixer from '@/components/admin/UserRoleFixer';

const ToolsTab = () => {
  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">User Role Fixer</h2>
        <UserRoleFixer />
      </div>
    </div>
  );
};

export default ToolsTab;
