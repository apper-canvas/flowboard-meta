import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useProjects } from "@/hooks/useProjects";

const Sidebar = ({ isOpen, onClose }) => {
  const { projects, loading } = useProjects();
  const [showCreateProject, setShowCreateProject] = useState(false);

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/projects", label: "All Projects", icon: "FolderOpen" },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Trello" size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FlowBoard
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Projects Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Projects
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateProject(!showCreateProject)}
              className="h-6 w-6 p-0"
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>

          <div className="space-y-1">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              projects.map((project) => (
                <NavLink
                  key={project.Id}
                  to={`/projects/${project.Id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm truncate">{project.name}</span>
                </NavLink>
              ))
            )}
          </div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;