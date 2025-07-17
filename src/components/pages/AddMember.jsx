import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMembers } from "@/hooks/useMembers";
import MemberForm from "@/components/organisms/MemberForm";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AddMember = () => {
  const navigate = useNavigate();
  const { createMember } = useMembers();

  const handleSave = async (memberData) => {
    await createMember(memberData);
    navigate("/members");
  };

  const handleCancel = () => {
    navigate("/members");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Member</h1>
          <p className="text-gray-600">Enter member information to add them to the directory</p>
        </div>
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          <span>Back to Members</span>
        </Button>
      </div>

      <MemberForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </motion.div>
  );
};

export default AddMember;