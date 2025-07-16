import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

export const useTasks = (projectId = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (projectId) {
        data = await taskService.getByProject(projectId);
      } else {
        data = await taskService.getAll();
      }
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setError(null);
      const newTask = await taskService.create({
        ...taskData,
        projectId: projectId || taskData.projectId
      });
      setTasks(prev => [...prev, newTask]);
      toast.success("Task created successfully!");
      return newTask;
    } catch (err) {
      setError(err.message);
      toast.error("Failed to create task");
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      setError(null);
      const updatedTask = await taskService.update(id, taskData);
      setTasks(prev => 
        prev.map(task => 
          task.Id === id ? updatedTask : task
        )
      );
      toast.success("Task updated successfully!");
      return updatedTask;
    } catch (err) {
      setError(err.message);
      toast.error("Failed to update task");
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      setError(null);
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.Id !== id));
      toast.success("Task deleted successfully!");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to delete task");
      throw err;
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: loadTasks
  };
};