import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import TaskModal from "@/components/organisms/TaskModal";
import FilterBar from "@/components/molecules/FilterBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";

const ProjectBoard = () => {
  const { projectId } = useParams();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks(projectId);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    dateRange: "all"
  });

  const project = projects.find(p => p.Id === parseInt(projectId));

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (projectsLoading || tasksLoading) {
    return <Loading type="board" />;
  }

  if (projectsError || tasksError) {
    return <Error message={projectsError || tasksError} />;
  }

  if (!project) {
    return <Error message="Project not found" />;
  }

  return (
    <div className="h-full flex flex-col">
      <Header
        title={project.name}
        subtitle={project.description}
        onSearch={handleSearch}
        onCreateTask={handleCreateTask}
      />

      <div className="p-6 pb-0">
        <FilterBar onFilterChange={handleFilterChange} filters={filters} />
      </div>

      <div className="flex-1 overflow-hidden">
        {tasks.length === 0 ? (
          <Empty
            icon="Kanban"
            title="No tasks in this project"
            description="Create your first task to start organizing your project workflow"
            actionLabel="Create Task"
            onAction={handleCreateTask}
          />
        ) : (
          <KanbanBoard
            projectId={projectId}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectBoard;