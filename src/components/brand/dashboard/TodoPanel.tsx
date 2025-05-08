
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  type: 'review' | 'confirm' | 'signoff' | 'next_stage';
  projectId: string;
  projectName: string;
  currentStage: string;
  nextStage: string;
}

interface TodoPanelProps {
  items: TodoItem[];
}

const TodoPanel: React.FC<TodoPanelProps> = ({ items }) => {
  const navigate = useNavigate();

  const handleActionClick = (projectId: string) => {
    navigate(`/brand/orders?projectId=${projectId}`);
  };

  if (items.length === 0) {
    return (
      <Card className="border-0 shadow-md rounded-xl bg-gradient-to-r from-slate-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-semibold">
            <Bell className="h-5 w-5 text-amber-500" />
            Pending Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div className="rounded-full bg-slate-100 p-3 mb-3">
              <Bell className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-center">No pending actions at the moment</p>
            <p className="text-sm text-center text-slate-400 mt-1">
              You're all caught up!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md rounded-xl bg-gradient-to-r from-slate-50 to-white overflow-hidden">
      <CardHeader className="pb-2 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-semibold">
          <Bell className="h-5 w-5 text-amber-500" />
          Pending Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className={`flex items-start justify-between p-4 hover:bg-slate-50 transition-colors ${
              index !== items.length - 1 ? 'border-b border-slate-100' : ''
            }`}
          >
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="rounded-full bg-amber-100 p-1.5">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-800">{item.title}</h4>
                <p className="text-sm text-slate-500 mt-0.5">
                  {item.description}
                </p>
                {item.type === 'next_stage' && (
                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.currentStage}
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                    <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {item.nextStage}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button 
              size="sm"
              onClick={() => handleActionClick(item.projectId)}
              className="whitespace-nowrap ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
            >
              Take Action
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TodoPanel;
