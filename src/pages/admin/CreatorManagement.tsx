
import { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose 
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Check, Edit, Upload } from 'lucide-react';

type Creator = {
  id: string;
  name: string;
  category: string;
  followers: number;
  status: 'active' | 'pending' | 'inactive';
};

const mockCreators: Creator[] = [
  { id: '1', name: 'Emma Johnson', category: 'Lifestyle', followers: 125000, status: 'active' },
  { id: '2', name: 'Michael Smith', category: 'Tech', followers: 98000, status: 'active' },
  { id: '3', name: 'Sophia Williams', category: 'Fashion', followers: 240000, status: 'pending' },
  { id: '4', name: 'James Brown', category: 'Fitness', followers: 87000, status: 'inactive' },
  { id: '5', name: 'Olivia Davis', category: 'Food', followers: 156000, status: 'active' },
];

const CreatorManagement = () => {
  const [creators] = useState<Creator[]>(mockCreators);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCreator, setCurrentCreator] = useState<Creator | null>(null);

  const filteredCreators = creators.filter(creator => 
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (creator: Creator) => {
    setCurrentCreator(creator);
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Creator Management</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload New Creator
        </Button>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="Search creators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Followers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCreators.map((creator) => (
              <TableRow key={creator.id}>
                <TableCell className="font-medium">{creator.name}</TableCell>
                <TableCell>{creator.category}</TableCell>
                <TableCell className="text-right">{creator.followers.toLocaleString()}</TableCell>
                <TableCell>
                  <div className={`flex items-center justify-center w-24 rounded-full px-2 py-1 text-xs font-medium ${
                    creator.status === 'active' ? 'bg-green-100 text-green-800' :
                    creator.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {creator.status === 'active' && <Check className="mr-1 h-3 w-3" />}
                    {creator.status.charAt(0).toUpperCase() + creator.status.slice(1)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(creator)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Creator Sheet */}
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Creator Profile</SheetTitle>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentCreator?.name || ''}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={currentCreator?.category || ''}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="followers" className="text-right">
                Followers
              </Label>
              <Input
                id="followers"
                type="number"
                value={currentCreator?.followers || 0}
                className="col-span-3"
              />
            </div>
          </div>
          
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreatorManagement;
