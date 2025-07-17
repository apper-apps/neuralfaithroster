import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, gradient, change, changeType }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${gradient ? "text-gradient" : "text-gray-900"}`}>
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={changeType === "increase" ? "TrendingUp" : "TrendingDown"} 
                size={14} 
                className={changeType === "increase" ? "text-green-500" : "text-red-500"} 
              />
              <span className={`text-sm ml-1 ${changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${gradient || "bg-gray-100"}`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;