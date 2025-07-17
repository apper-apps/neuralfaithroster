import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  icon = "Database",
  action,
  actionText = "Add Item"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center">
            <ApperIcon name={icon} size={32} className="text-accent-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {action && (
          <Button
            onClick={action}
            variant="primary"
            className="flex items-center space-x-2 mx-auto"
          >
            <ApperIcon name="Plus" size={16} />
            <span>{actionText}</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;