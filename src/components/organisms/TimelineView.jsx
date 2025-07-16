import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { format, addDays, differenceInDays, startOfDay, endOfDay } from "date-fns";
import Card from "@/components/atoms/Card";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import ApperIcon from "@/components/ApperIcon";
import { useTasks } from "@/hooks/useTasks";

const TimelineView = ({ projectId, onTaskClick }) => {
  const { tasks, loading, updateTask } = useTasks(projectId);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const timelineRef = useRef(null);

  // Calculate timeline bounds
  const getTimelineBounds = () => {
    if (tasks.length === 0) return { start: new Date(), end: addDays(new Date(), 30) };
    
    const dates = tasks.flatMap(task => [
      new Date(task.startDate || task.createdAt),
      new Date(task.dueDate || task.createdAt)
    ]);
    
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    return {
      start: addDays(minDate, -7),
      end: addDays(maxDate, 7)
    };
  };

  const { start: timelineStart, end: timelineEnd } = getTimelineBounds();
  const totalDays = differenceInDays(timelineEnd, timelineStart);
  const dayWidth = 120; // pixels per day

  // Generate timeline dates
  const timelineDates = [];
  for (let i = 0; i <= totalDays; i++) {
    timelineDates.push(addDays(timelineStart, i));
  }

  // Calculate task position and width
  const getTaskPosition = (task) => {
    const taskStart = new Date(task.startDate || task.createdAt);
    const taskEnd = new Date(task.dueDate || task.createdAt);
    const startDays = differenceInDays(taskStart, timelineStart);
    const duration = Math.max(1, differenceInDays(taskEnd, taskStart));
    
    return {
      left: startDays * dayWidth,
      width: duration * dayWidth,
      duration
    };
  };

  // Handle drag start
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset(e.clientX - rect.left);
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag over timeline
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drop on timeline
  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedTask || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left - dragOffset;
    const dayIndex = Math.round(dropX / dayWidth);
    const newStartDate = addDays(timelineStart, dayIndex);
    
    const taskDuration = differenceInDays(
      new Date(draggedTask.dueDate || draggedTask.createdAt),
      new Date(draggedTask.startDate || draggedTask.createdAt)
    );
    
    const newDueDate = addDays(newStartDate, Math.max(1, taskDuration));

    updateTask(draggedTask.Id, {
      startDate: newStartDate.toISOString(),
      dueDate: newDueDate.toISOString()
    });

    setDraggedTask(null);
  };

  // Get task dependencies
  const getTaskDependencies = (task) => {
    return tasks.filter(t => task.dependencies?.includes(t.Id));
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "done": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "todo": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  // TaskBar component
  const TaskBar = ({ task, style }) => {
    const position = getTaskPosition(task);
    const dependencies = getTaskDependencies(task);
    
    return (
      <div className="relative">
        {/* Dependency lines */}
        {dependencies.map(depTask => {
          const depPosition = getTaskPosition(depTask);
          const lineStart = depPosition.left + depPosition.width;
          const lineEnd = position.left;
          const lineWidth = lineEnd - lineStart;
          
          if (lineWidth > 0) {
            return (
              <svg
                key={depTask.Id}
                className="absolute top-4 pointer-events-none"
                style={{
                  left: lineStart,
                  width: lineWidth,
                  height: 2,
                  zIndex: 1
                }}
              >
                <line
                  x1={0}
                  y1={1}
                  x2={lineWidth}
                  y2={1}
                  stroke="#6B7280"
                  strokeWidth={2}
                  strokeDasharray="4,4"
                />
                <polygon
                  points={`${lineWidth-6},0 ${lineWidth},1 ${lineWidth-6},2`}
                  fill="#6B7280"
                />
              </svg>
            );
          }
          return null;
        })}
        
        {/* Task bar */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          draggable
          onDragStart={(e) => handleDragStart(e, task)}
          onClick={() => onTaskClick(task)}
          className="absolute cursor-pointer group z-10"
          style={style}
        >
          <Card className="h-12 p-2 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
            <div className="flex items-center gap-2 h-full">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
              <span className="text-sm font-medium text-gray-900 truncate flex-1">
                {task.title}
              </span>
              <PriorityBadge priority={task.priority} size="sm" />
            </div>
          </Card>
          
          {/* Hover tooltip */}
          <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
            {task.title}
            <br />
            {format(new Date(task.startDate || task.createdAt), "MMM dd")} - {format(new Date(task.dueDate || task.createdAt), "MMM dd")}
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded animate-pulse" />
          <div className="h-48 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Timeline View</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <span>To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Done</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div 
            ref={timelineRef}
            className="relative"
            style={{ 
              width: totalDays * dayWidth,
              minWidth: '100%'
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Timeline header */}
            <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-30">
              {timelineDates.map((date, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 p-3 text-center border-r border-gray-200"
                  style={{ width: dayWidth }}
                >
                  <div className="text-xs text-gray-500">
                    {format(date, "EEE")}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {format(date, "dd")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(date, "MMM")}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline grid */}
            <div className="relative" style={{ height: Math.max(400, tasks.length * 60 + 40) }}>
              {/* Grid lines */}
              {timelineDates.map((date, index) => (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 border-r border-gray-100"
                  style={{ left: index * dayWidth }}
                />
              ))}

              {/* Today line */}
              {(() => {
                const today = new Date();
                const todayDays = differenceInDays(today, timelineStart);
                if (todayDays >= 0 && todayDays <= totalDays) {
                  return (
                    <div
                      className="absolute top-0 bottom-0 border-r-2 border-red-500 bg-red-50"
                      style={{ left: todayDays * dayWidth, width: 2 }}
                    />
                  );
                }
                return null;
              })()}

              {/* Task bars */}
              {tasks.map((task, index) => {
                const position = getTaskPosition(task);
                return (
                  <TaskBar
                    key={task.Id}
                    task={task}
                    style={{
                      left: position.left,
                      width: position.width,
                      top: 40 + index * 60
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;