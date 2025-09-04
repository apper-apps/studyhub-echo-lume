import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by creating your first item", 
  icon = "FileX",
  action,
  actionLabel = "Create New",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name={icon} size={48} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {action && (
        <Button onClick={action} className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600">
          <ApperIcon name="Plus" size={18} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;