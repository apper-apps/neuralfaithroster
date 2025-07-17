import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry, title = "Something went wrong" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">
          {message || "We encountered an error while loading the data. Please try again."}
        </p>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            className="flex items-center space-x-2 mx-auto"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Try Again</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Error;