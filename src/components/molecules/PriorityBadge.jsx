import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return { variant: "high", icon: "AlertCircle", label: "High" };
      case "medium":
        return { variant: "medium", icon: "Clock", label: "Medium" };
      case "low":
        return { variant: "low", icon: "CheckCircle", label: "Low" };
      default:
        return { variant: "default", icon: "Circle", label: "None" };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <ApperIcon name={config.icon} size={12} />
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;