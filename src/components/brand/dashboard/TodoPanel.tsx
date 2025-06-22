
import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'action' | 'review' | 'setup';
  dueDate?: string;
  route?: string;
}

interface TodoPanelProps {
  todos: TodoItem[];
  onMarkComplete?: (todoId: string) => void;
  onViewAll?: () => void;
}

const TodoPanel: React.FC<TodoPanelProps> = React.memo(({ 
  todos = [], 
  onMarkComplete,
  onViewAll 
}) => {
  const navigate = useNavigate();

  const priorityConfig = useMemo(() => ({
    high: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
    medium: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    low: { color: 'bg-green-100 text-green-800', icon: CheckCircle }
  }), []);

  const handleTodoClick = useCallback((todo: TodoItem) => {
    if (todo.route) {
      navigate(todo.route);
    }
  }, [navigate]);

  const handleMarkComplete = useCallback((e: React.MouseEvent, todoId: string) => {
    e.stopPropagation();
    onMarkComplete?.(todoId);
  }, [onMarkComplete]);

  const displayTodos = todos.slice(0, 5);

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Action Items</CardTitle>
          {todos.length > 5 && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="text-foreground">
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayTodos.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">All caught up!</h3>
            <p className="text-foreground">
              No pending action items at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTodos.map((todo) => {
              const PriorityIcon = priorityConfig[todo.priority].icon;
              return (
                <div
                  key={todo.id}
                  className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors group"
                  onClick={() => handleTodoClick(todo)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {todo.title}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${priorityConfig[todo.priority].color}`}
                        >
                          <PriorityIcon className="h-3 w-3 mr-1" />
                          {todo.priority}
                        </Badge>
                      </div>
                      <p className="text-foreground text-xs line-clamp-2">
                        {todo.description}
                      </p>
                      {todo.dueDate && (
                        <p className="text-foreground text-xs mt-1">
                          Due: {todo.dueDate}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {onMarkComplete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                          onClick={(e) => handleMarkComplete(e, todo.id)}
                          aria-label="Mark as complete"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      <ChevronRight className="h-4 w-4 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

TodoPanel.displayName = 'TodoPanel';

export default TodoPanel;
