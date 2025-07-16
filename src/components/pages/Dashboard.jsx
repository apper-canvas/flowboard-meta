import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ProgressRing from "@/components/molecules/ProgressRing";
import ProjectCard from "@/components/organisms/ProjectCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";

const Dashboard = () => {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks();
  
  const getOverallStats = () => {
    if (tasksLoading || !tasks.length) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        progress: 0
      };
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "done").length;
    const inProgressTasks = tasks.filter(task => task.status === "in-progress").length;
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== "done";
    }).length;

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      progress
    };
  };

  const stats = getOverallStats();

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: "CheckSquare",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: "CheckCircle",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: "Clock",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Overdue",
      value: stats.overdueTasks,
      icon: "AlertCircle",
      color: "text-error",
      bgColor: "bg-error/10"
    }
  ];

  if (projectsLoading) {
    return <Loading type="dashboard" />;
  }

  if (projectsError) {
    return <Error message={projectsError} />;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of your projects and tasks
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ProgressRing progress={stats.progress} size={80} />
          <div>
            <p className="text-sm text-gray-600">Overall Progress</p>
            <p className="text-2xl font-bold text-gray-900">{stats.progress}%</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} size={24} className={stat.color} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
          <Button variant="ghost" className="flex items-center gap-2">
            <span>View All</span>
            <ApperIcon name="ArrowRight" size={16} />
          </Button>
        </div>

        {projects.length === 0 ? (
          <Empty
            icon="FolderOpen"
            title="No projects yet"
            description="Create your first project to start managing tasks and tracking progress"
            actionLabel="Create Project"
            onAction={() => {/* TODO: Implement create project */}}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;