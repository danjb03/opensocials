
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { CreatorCRMTable } from '@/components/admin/crm/creators/CreatorCRMTable';
import { CreatorCRMSearch } from '@/components/admin/crm/creators/CreatorCRMSearch';
import { useCreatorCRM } from '@/hooks/admin/useCreatorCRM';
import { Button } from '@/components/ui/button';

export default function CreatorsCRM() {
  const { creators, isLoading, isError, searchQuery, handleSearch } = useCreatorCRM();

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Creator CRM</h1>
          <div className="flex items-center gap-4">
            <CreatorCRMSearch onSearch={handleSearch} initialValue={searchQuery} />
            <Button variant="outline" asChild>
              <Link to="/admin/crm/creators/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin h-6 w-6" />
          </div>
        )}

        {isError && <p className="text-red-500">Failed to load data.</p>}

        {!isLoading && <CreatorCRMTable creators={creators} />}
      </div>
    </AdminLayout>
  );
}
