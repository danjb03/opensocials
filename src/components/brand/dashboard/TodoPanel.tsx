
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  type: 'review' | 'confirm' | 'signoff';
  projectId: string;
}

interface TodoPanelProps {
  items: TodoItem[];
}

const TodoPanel: React.FC<TodoPanelProps> = ({ items }) => {
  const navigate = useNavigate();

  const handleActionClick = (projectId: string) => {
    navigate(`/brand/projects/${projectId}`);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Pending Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-muted-foreground">No pending actions at the moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Pending Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between border-l-4 border-primary pl-4 py-2">
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due soon
              </span>
              <Button 
                size="sm"
                onClick={() => handleActionClick(item.projectId)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Action
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TodoPanel;
