import { useState } from "react";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ onFilterChange, filters = {} }) => {
  const [activeFilters, setActiveFilters] = useState({
    status: filters.status || "all",
    priority: filters.priority || "all",
    dateRange: filters.dateRange || "all",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      status: "all",
      priority: "all",
      dateRange: "all",
    };
    setActiveFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== "all");

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <ApperIcon name="Filter" size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>
      
      <Select
        value={activeFilters.status}
        onChange={(e) => handleFilterChange("status", e.target.value)}
        className="w-32"
      >
        <option value="all">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </Select>

      <Select
        value={activeFilters.priority}
        onChange={(e) => handleFilterChange("priority", e.target.value)}
        className="w-32"
      >
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </Select>

      <Select
        value={activeFilters.dateRange}
        onChange={(e) => handleFilterChange("dateRange", e.target.value)}
        className="w-32"
      >
        <option value="all">All Dates</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="overdue">Overdue</option>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-gray-600 hover:text-gray-900"
        >
          <ApperIcon name="X" size={14} className="mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default FilterBar;