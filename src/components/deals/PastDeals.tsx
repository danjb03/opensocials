
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  deadline?: string | null;
  project_brief?: string | null;
  campaign_goals?: string | null;
  target_audience?: string | null;
  deliverables?: string[] | null;
  profiles: {
    company_name: string;
  };
}

interface PastDealsProps {
  deals: Deal[];
}

const PastDeals = ({ deals }: PastDealsProps) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Past Deals</h2>
        <span className="text-sm text-muted-foreground">
          {deals.length} past {deals.length === 1 ? 'deal' : 'deals'}
        </span>
      </div>

      {deals.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Brand</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.profiles?.company_name || 'Unknown Brand'}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{deal.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{deal.description}</p>
                      
                      {deal.deliverables && deal.deliverables.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {deal.deliverables.slice(0, 2).map((item, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{item}</Badge>
                          ))}
                          {deal.deliverables.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{deal.deliverables.length - 2} more</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${deal.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={`${
                      deal.status === 'accepted' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}>
                      {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{new Date(deal.created_at || '').toLocaleDateString()}</span>
                      {deal.deadline && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <CalendarDays className="h-3 w-3" /> 
                          Deadline: {new Date(deal.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="details" className="border-none">
                        <AccordionTrigger className="py-0">
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            View Details
                          </Button>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0 pt-2">
                          <div className="text-sm space-y-2">
                            {deal.project_brief && (
                              <div>
                                <p className="font-medium">Project Brief:</p>
                                <p className="text-muted-foreground">{deal.project_brief}</p>
                              </div>
                            )}
                            
                            {deal.campaign_goals && (
                              <div>
                                <p className="font-medium">Campaign Goals:</p>
                                <p className="text-muted-foreground">{deal.campaign_goals}</p>
                              </div>
                            )}
                            
                            {deal.feedback && (
                              <div>
                                <p className="font-medium">Feedback:</p>
                                <p className="text-muted-foreground">{deal.feedback}</p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No past deals to show.
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default PastDeals;
