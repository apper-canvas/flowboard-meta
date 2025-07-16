import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import ApperIcon from "@/components/ApperIcon";
import { useTasks } from "@/hooks/useTasks";

const KanbanBoard = ({ projectId, onTaskClick }) => {
  const { tasks, loading, updateTask } = useTasks(projectId);
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", color: "bg-gray-100", count: 0 },
    { id: "in-progress", title: "In Progress", color: "bg-blue-100", count: 0 },
    { id: "done", title: "Done", color: "bg-green-100", count: 0 },
  ];

  // Calculate task counts
  const tasksByStatus = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const columnsWithCounts = columns.map((column) => ({
    ...column,
    count: tasksByStatus[column.id] || 0,
  }));

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      updateTask(draggedTask.Id, { status });
    }
    setDraggedTask(null);
  };

  const TaskCard = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onClick={() => onTaskClick(task)}
      className="cursor-pointer"
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
            <ApperIcon name="MoreVertical" size={16} className="text-gray-400" />
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <PriorityBadge priority={task.priority} />
            {task.dueDate && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <ApperIcon name="Calendar" size={12} />
                {format(new Date(task.dueDate), "MMM dd")}
              </span>
            )}
          </div>
          
          {task.progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex gap-6 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 space-y-4">
            <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6 h-full overflow-x-auto">
      {columnsWithCounts.map((column) => (
        <div
          key={column.id}
          className="flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
            </div>
            <Badge variant="secondary">{column.count}</Badge>
          </div>
          
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <TaskCard key={task.Id} task={task} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;