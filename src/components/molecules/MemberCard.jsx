import React from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const MemberCard = ({ member, onClick }) => {
  return (
    <Card hover onClick={onClick} className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {member.firstName} {member.lastName}
          </h3>
          <StatusBadge status={member.status} />
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <ApperIcon name="Phone" size={14} />
          <ApperIcon name="Mail" size={14} />
        </div>
      </div>
      
      <div className="mt-3 space-y-1">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Mail" size={14} className="mr-2" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Phone" size={14} className="mr-2" />
          <span>{member.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" size={14} className="mr-2" />
          <span>Joined {format(new Date(member.joinDate), "MMM d, yyyy")}</span>
        </div>
      </div>
    </Card>
  );
};

export default MemberCard;