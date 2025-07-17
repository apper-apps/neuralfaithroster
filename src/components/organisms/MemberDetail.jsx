import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Members from "@/components/pages/Members";
import StatusBadge from "@/components/molecules/StatusBadge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { memberService } from "@/services/api/memberService";
const FamilyMembersSection = ({ member }) => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFamilyMembers = async () => {
      try {
        setLoading(true);
        const members = await memberService.getFamilyMembers(member.Id);
        setFamilyMembers(members);
      } catch (error) {
        console.error("Failed to load family members:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFamilyMembers();
  }, [member.Id]);

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Users" size={20} className="mr-2" />
          Family Members
        </h2>
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </Card>
    );
  }

  if (familyMembers.length <= 1) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Users" size={20} className="mr-2" />
          Family Members
        </h2>
        <p className="text-gray-500 text-sm">No other family members found.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ApperIcon name="Users" size={20} className="mr-2" />
        Family Members ({familyMembers.length})
      </h2>
      <div className="space-y-3">
        {familyMembers.map((familyMember) => (
          <div
            key={familyMember.Id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {familyMember.firstName[0]}{familyMember.lastName[0]}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {familyMember.firstName} {familyMember.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {familyMember.email}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <StatusBadge status={familyMember.status} />
              {familyMember.Id !== member.Id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = `/members/${familyMember.Id}`}
                >
                  <ApperIcon name="Eye" size={16} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const MemberDetail = ({ member, onEdit, onClose }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {member.firstName[0]}{member.lastName[0]}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {member.firstName} {member.lastName}
            </h1>
            <StatusBadge status={member.status} />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={onEdit}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Edit" size={16} />
            <span>Edit</span>
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="X" size={16} />
            <span>Close</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="User" size={20} className="mr-2" />
              Personal Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{member.firstName} {member.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{member.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{member.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-gray-900">{member.address}</p>
              </div>
              {member.birthDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Birth Date</label>
                  <p className="text-gray-900">
                    {format(new Date(member.birthDate), "MMMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Calendar" size={20} className="mr-2" />
              Membership Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <StatusBadge status={member.status} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Join Date</label>
                <p className="text-gray-900">
                  {format(new Date(member.joinDate), "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-gray-900">
                  {format(new Date(member.joinDate), "yyyy")} ({Math.floor((new Date() - new Date(member.joinDate)) / (1000 * 60 * 60 * 24 * 365))} years)
                </p>
              </div>
            </div>
</Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <FamilyMembersSection member={member} />
        </motion.div>

        {member.notes && (
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="FileText" size={20} className="mr-2" />
                Notes
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{member.notes}</p>
            </Card>
</motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MemberDetail;