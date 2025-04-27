
import { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger 
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Send, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

type OrderStatus = 'pending' | 'accepted' | 'declined' | 'completed';

type Order = {
  id: string;
  brandName: string;
  project: string;
  budget: number;
  createdAt: string;
  status: OrderStatus;
  creatorsAccepted: number;
  totalCreators: number;
};

const mockOrders: Order[] = [
  { 
    id: 'order-001', 
    brandName: 'FitStyle', 
    project: 'Summer Activewear Campaign', 
    budget: 5000, 
    createdAt: '2023-03-15', 
    status: 'pending',
    creatorsAccepted: 0,
    totalCreators: 5
  },
  { 
    id: 'order-002', 
    brandName: 'EcoBeauty', 
    project: 'Skincare Product Launch', 
    budget: 7500, 
    createdAt: '2023-03-18', 
    status: 'accepted',
    creatorsAccepted: 2,
    totalCreators: 4
  },
  { 
    id: 'order-003', 
    brandName: 'TechGadgets', 
    project: 'New Earbuds Promotion', 
    budget: 10000, 
    createdAt: '2023-03-20', 
    status: 'completed',
    creatorsAccepted: 6,
    totalCreators: 6
  },
];

const OrderManagement = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => 
    order.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      <div className="mb-4">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Creator Acceptance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.brandName}</TableCell>
                <TableCell>{order.project}</TableCell>
                <TableCell className="text-right">${order.budget.toLocaleString()}</TableCell>
                <TableCell>{order.createdAt}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'declined' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'completed' && <Check className="mr-1 h-3 w-3" />}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </TableCell>
                <TableCell>
                  {order.creatorsAccepted}/{order.totalCreators}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedOrder(order)}
                      >
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Manage Order: {order.project}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Order Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <dl className="space-y-2">
                                <div className="flex justify-between">
                                  <dt className="font-medium">Brand:</dt>
                                  <dd>{order.brandName}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="font-medium">Budget:</dt>
                                  <dd>${order.budget.toLocaleString()}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="font-medium">Status:</dt>
                                  <dd>{order.status}</dd>
                                </div>
                              </dl>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Creator Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span>Creator 1</span>
                                  <div className="flex items-center text-green-600">
                                    <CheckCircle className="h-4 w-4 mr-1" /> Accepted
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Creator 2</span>
                                  <div className="flex items-center text-green-600">
                                    <CheckCircle className="h-4 w-4 mr-1" /> Accepted
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Creator 3</span>
                                  <Button size="sm" variant="outline">
                                    <Send className="h-3 w-3 mr-1" /> Send Offer
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div>
                          <div className="space-y-2">
                            <Label htmlFor="brief">Brief Notes</Label>
                            <Input id="brief" defaultValue="" placeholder="Add brief notes or instructions" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Update Order</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderManagement;
