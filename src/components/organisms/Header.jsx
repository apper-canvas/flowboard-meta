import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title, 
  subtitle, 
  onSearch, 
  onCreateTask, 
  onToggleSidebar,
  showCreateButton = true 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {onSearch && (
            <div className="w-64 hidden sm:block">
              <SearchBar onSearch={onSearch} placeholder="Search tasks..." />
            </div>
          )}
          
          {showCreateButton && onCreateTask && (
            <Button onClick={onCreateTask} className="flex items-center gap-2">
              <ApperIcon name="Plus" size={16} />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;