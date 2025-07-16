import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import ProjectCard from "@/components/organisms/ProjectCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { useProjects } from "@/hooks/useProjects";

const AllProjects = () => {
  const { projects, loading, error } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="h-full flex flex-col">
      <Header
        title="All Projects"
        subtitle="Manage and organize your project portfolio"
        onSearch={handleSearch}
        showCreateButton={false}
      />

      <div className="flex-1 p-6">
        {projects.length === 0 ? (
          <Empty
            icon="FolderOpen"
            title="No projects yet"
            description="Create your first project to start managing tasks and tracking progress"
            actionLabel="Create Project"
            onAction={() => {/* TODO: Implement create project */}}
          />
        ) : filteredProjects.length === 0 ? (
          <Empty
            icon="Search"
            title="No projects found"
            description="Try adjusting your search criteria to find the project you're looking for"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
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

export default AllProjects;