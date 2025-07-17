import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "visitor":
        return { variant: "visitor", text: "Visitor" };
      case "new member":
        return { variant: "new", text: "New Member" };
      case "active":
        return { variant: "active", text: "Active" };
      case "inactive":
        return { variant: "inactive", text: "Inactive" };
      default:
        return { variant: "default", text: status || "Unknown" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default StatusBadge;