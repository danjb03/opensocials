
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
        <p className="text-xl text-gray-600">
          {user 
            ? `Welcome, ${user.email}! You are logged in as a ${role}.` 
            : 'Start building your amazing project here!'}
        </p>
        {role === 'admin' && (
          <div className="mt-4">
            <Link 
              to="/admin/users" 
              className="text-blue-500 hover:underline"
            >
              Manage Users
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
