import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ProgressRing from "@/components/molecules/ProgressRing";
import ApperIcon from "@/components/ApperIcon";
import { useTasks } from "@/hooks/useTasks";

const ProjectCard = ({ project }) => {
  const { tasks, loading } = useTasks(project.Id);

  const getProjectStats = () => {
    if (loading || !tasks.length) {
      return { totalTasks: 0, completedTasks: 0, progress: 0 };
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "done").length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalTasks, completedTasks, progress };
  };

  const stats = getProjectStats();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Link to={`/projects/${project.Id}`}>
        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-l-4 group cursor-pointer"
              style={{ borderLeftColor: project.color }}>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {project.description}
                </p>
              </div>
              <div className="ml-4">
                <ProgressRing progress={stats.progress} size={50} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <ApperIcon name="CheckSquare" size={16} />
                  <span>{stats.completedTasks}/{stats.totalTasks} tasks</span>
                </div>
                <Badge
                  variant={stats.progress === 100 ? "success" : stats.progress > 50 ? "warning" : "default"}
                >
                  {stats.progress === 100 ? "Complete" : stats.progress > 0 ? "In Progress" : "Not Started"}
                </Badge>
              </div>
              
              <ApperIcon 
                name="ArrowRight" 
                size={16} 
                className="text-gray-400 group-hover:text-primary transition-colors" 
              />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;