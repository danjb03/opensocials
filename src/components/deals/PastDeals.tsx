
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Deal {
  id: string;
  title: string;
  description: string | null;
  value: number;
  status: string;
  feedback: string | null;
  creator_id: string;
  brand_id: string;
  created_at: string | null;
  updated_at: string | null;
  profiles: {
    company_name: string;
  };
}

interface PastDealsProps {
  deals: Deal[];
}

const PastDeals = ({ deals }: PastDealsProps) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Past Deals</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardHeader>
              <CardTitle>{deal.title}</CardTitle>
              <CardDescription>
                From {deal.profiles?.company_name || 'Unknown Brand'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{deal.description}</p>
              <p className="font-bold">Value: ${deal.value.toLocaleString()}</p>
              <p className="mt-2">
                Status: <span className="capitalize">{deal.status}</span>
              </p>
              {deal.feedback && (
                <div className="mt-2">
                  <p className="font-semibold">Feedback:</p>
                  <p>{deal.feedback}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {deals.length === 0 && (
          <p className="text-gray-500">No past deals to show.</p>
        )}
      </div>
    </section>
  );
};

export default PastDeals;

