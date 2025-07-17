import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { memberService } from "@/services/api/memberService";
import { useMembers } from "@/hooks/useMembers";
import MemberForm from "@/components/organisms/MemberForm";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const EditMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateMember } = useMembers();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMember = async () => {
    try {
      setLoading(true);
      setError("");
      const memberData = await memberService.getById(id);
      setMember(memberData);
    } catch (err) {
      setError(err.message || "Failed to load member");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMember();
  }, [id]);

  const handleSave = async (memberData) => {
    await updateMember(id, memberData);
    navigate("/members");
  };

  const handleCancel = () => {
    navigate("/members");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
        <div className="bg-surface rounded-lg border border-gray-200 p-6">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadMember} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Member - {member?.firstName} {member?.lastName}
          </h1>
          <p className="text-gray-600">Update member information</p>
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
        member={member}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </motion.div>
  );
};

export default EditMember;