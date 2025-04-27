import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Kanban } from 'lucide-react';

// Types for orders
interface Creator {
  id: number;
  name: string;
  platform: string;
  imageUrl: string;
}

interface Order {
  id: number;
  title: string;
  createdAt: string;
  status: 'potential' | 'rtg' | 'completed';
  creators: Creator[];
}

// Mock data
const mockOrders: Order[] = [
  {
    id: 101,
    title: "Summer Campaign",
    createdAt: "2023-04-15",
    status: "potential",
    creators: [
      { id: 1, name: "Alex Johnson", platform: "Instagram", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      { id: 2, name: "Sam Rivera", platform: "YouTube", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
    ]
  },
  {
    id: 102,
    title: "Product Launch",
    createdAt: "2023-05-20",
    status: "rtg",
    creators: [
      { id: 3, name: "Jamie Chen", platform: "TikTok", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
    ]
  },
  {
    id: 103,
    title: "Holiday Special",
    createdAt: "2023-06-10",
    status: "completed",
    creators: [
      { id: 4, name: "Taylor Singh", platform: "Instagram", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      { id: 5, name: "Morgan Lee", platform: "Twitter", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
    ]
  },
  {
    id: 104,
    title: "Brand Awareness",
    createdAt: "2023-07-05",
    status: "potential",
    creators: [
      { id: 6, name: "Casey Wilson", platform: "YouTube", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
    ]
  },
  {
    id: 105,
    title: "Social Media Boost",
    createdAt: "2023-07-15",
    status: "rtg",
    creators: [
      { id: 1, name: "Alex Johnson", platform: "Instagram", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      { id: 3, name: "Jamie Chen", platform: "TikTok", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
    ]
  },
];

const BrandOrders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<string>("kanban");

  const potentialOrders = orders.filter(order => order.status === 'potential');
  const rtgOrders = orders.filter(order => order.status === 'rtg');
  const completedOrders = orders.filter(order => order.status === 'completed');

  const moveOrder = (orderId: number, newStatus: 'potential' | 'rtg' | 'completed') => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Orders</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="kanban" className="flex items-center gap-2">
                <Kanban className="h-4 w-4" />
                <span>Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="kanban" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Card className="bg-gray-50">
                  <CardHeader className="bg-gray-100 rounded-t-lg">
                    <CardTitle className="text-lg">Potential Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    {potentialOrders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No potential orders</p>
                    ) : (
                      <div className="space-y-3">
                        {potentialOrders.map(order => (
                          <Card key={order.id} className="bg-white">
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">{order.title}</h3>
                              <p className="text-sm text-gray-500 mb-3">Created: {order.createdAt}</p>
                              <div className="flex items-center mb-3">
                                <div className="flex -space-x-2">
                                  {order.creators.slice(0, 3).map(creator => (
                                    <img 
                                      key={creator.id} 
                                      src={creator.imageUrl} 
                                      alt={creator.name} 
                                      className="w-8 h-8 rounded-full border-2 border-white"
                                      title={creator.name}
                                    />
                                  ))}
                                  {order.creators.length > 3 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs border-2 border-white">
                                      +{order.creators.length - 3}
                                    </div>
                                  )}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">
                                  {order.creators.length} creator{order.creators.length !== 1 && 's'}
                                </span>
                              </div>
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={() => moveOrder(order.id, 'rtg')}
                              >
                                Move to RTG
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card className="bg-gray-50">
                  <CardHeader className="bg-gray-100 rounded-t-lg">
                    <CardTitle className="text-lg">Ready to Go</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    {rtgOrders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No RTG orders</p>
                    ) : (
                      <div className="space-y-3">
                        {rtgOrders.map(order => (
                          <Card key={order.id} className="bg-white">
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">{order.title}</h3>
                              <p className="text-sm text-gray-500 mb-3">Created: {order.createdAt}</p>
                              <div className="flex items-center mb-3">
                                <div className="flex -space-x-2">
                                  {order.creators.slice(0, 3).map(creator => (
                                    <img 
                                      key={creator.id} 
                                      src={creator.imageUrl} 
                                      alt={creator.name} 
                                      className="w-8 h-8 rounded-full border-2 border-white"
                                      title={creator.name}
                                    />
                                  ))}
                                  {order.creators.length > 3 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs border-2 border-white">
                                      +{order.creators.length - 3}
                                    </div>
                                  )}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">
                                  {order.creators.length} creator{order.creators.length !== 1 && 's'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => moveOrder(order.id, 'potential')}
                                >
                                  Move Back
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => moveOrder(order.id, 'completed')}
                                >
                                  Complete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card className="bg-gray-50">
                  <CardHeader className="bg-gray-100 rounded-t-lg">
                    <CardTitle className="text-lg">Completed Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    {completedOrders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No completed orders</p>
                    ) : (
                      <div className="space-y-3">
                        {completedOrders.map(order => (
                          <Card key={order.id} className="bg-white">
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">{order.title}</h3>
                              <p className="text-sm text-gray-500 mb-3">Created: {order.createdAt}</p>
                              <div className="flex items-center mb-3">
                                <div className="flex -space-x-2">
                                  {order.creators.slice(0, 3).map(creator => (
                                    <img 
                                      key={creator.id} 
                                      src={creator.imageUrl} 
                                      alt={creator.name} 
                                      className="w-8 h-8 rounded-full border-2 border-white"
                                      title={creator.name}
                                    />
                                  ))}
                                  {order.creators.length > 3 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs border-2 border-white">
                                      +{order.creators.length - 3}
                                    </div>
                                  )}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">
                                  {order.creators.length} creator{order.creators.length !== 1 && 's'}
                                </span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => moveOrder(order.id, 'rtg')}
                                className="w-full"
                              >
                                Reactivate
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {orders.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No orders found</p>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="p-4 flex items-center">
                        <div className="flex-1">
                          <h3 className="font-bold">{order.title}</h3>
                          <p className="text-sm text-gray-500">Created: {order.createdAt}</p>
                        </div>
                        <div className="flex items-center mr-4">
                          <div className="flex -space-x-2 mr-2">
                            {order.creators.slice(0, 2).map(creator => (
                              <img 
                                key={creator.id} 
                                src={creator.imageUrl} 
                                alt={creator.name} 
                                className="w-6 h-6 rounded-full border-2 border-white"
                                title={creator.name}
                              />
                            ))}
                            {order.creators.length > 2 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs border-2 border-white">
                                +{order.creators.length - 2}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            order.status === 'potential' ? 'bg-blue-100 text-blue-800' : 
                            order.status === 'rtg' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status === 'potential' ? 'Potential' : 
                             order.status === 'rtg' ? 'Ready to Go' : 
                             'Completed'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BrandLayout>
  );
};

export default BrandOrders;
