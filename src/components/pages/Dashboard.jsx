import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { memberService } from "@/services/api/memberService";
import { attendanceService } from "@/services/api/attendanceService";
import StatCard from "@/components/molecules/StatCard";
import MemberCard from "@/components/molecules/MemberCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentMembers, setRecentMembers] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [memberStats, members, attendance] = await Promise.all([
        memberService.getStats(),
        memberService.getAll(),
        attendanceService.getStats()
      ]);
      
      setStats(memberStats);
      setAttendanceStats(attendance);
      
      // Get recent members (last 5)
      const sortedMembers = members
        .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
        .slice(0, 5);
      setRecentMembers(sortedMembers);
      
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <Loading type="stats" />
        <Loading type="cards" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-r from-accent-500 to-accent-600">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome to FaithRoster</h1>
              <p className="text-accent-100">
                Managing Grace Community Church with {stats?.total || 0} members
              </p>
            </div>
            <div className="hidden md:block">
              <ApperIcon name="Church" size={48} className="text-accent-200" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Members"
            value={stats?.total || 0}
            icon="Users"
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Active Members"
            value={stats?.active || 0}
            icon="UserCheck"
            gradient="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="New Members"
            value={stats?.newMembers || 0}
            icon="UserPlus"
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Visitors"
            value={stats?.visitors || 0}
            icon="Eye"
            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>
      </motion.div>

      {/* Recent Members */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Members</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/members")}
            className="flex items-center space-x-2"
          >
            <span>View All</span>
            <ApperIcon name="ArrowRight" size={16} />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentMembers.map((member) => (
            <MemberCard
              key={member.Id}
              member={member}
              onClick={() => navigate(`/members/${member.Id}`)}
            />
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="primary"
              onClick={() => navigate("/members/new")}
              className="flex items-center justify-center space-x-2 py-4"
            >
              <ApperIcon name="UserPlus" size={20} />
              <span>Add New Member</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/attendance")}
              className="flex items-center justify-center space-x-2 py-4"
            >
              <ApperIcon name="Calendar" size={20} />
              <span>Record Attendance</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/reports")}
              className="flex items-center justify-center space-x-2 py-4"
            >
              <ApperIcon name="FileText" size={20} />
              <span>View Reports</span>
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;