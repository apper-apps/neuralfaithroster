import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { memberService } from "@/services/api/memberService";
import { attendanceService } from "@/services/api/attendanceService";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  const [memberStats, setMemberStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [memberData, attendanceData, allMembers] = await Promise.all([
        memberService.getStats(),
        attendanceService.getStats(),
        memberService.getAll()
      ]);
      
      setMemberStats(memberData);
      setAttendanceStats(attendanceData);
      setMembers(allMembers);
    } catch (err) {
      setError(err.message || "Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      memberStats,
      attendanceStats,
      members: members.map(m => ({
        name: `${m.firstName} ${m.lastName}`,
        email: m.email,
        status: m.status,
        joinDate: m.joinDate
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `church-report-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBreakdown = () => {
    const breakdown = {};
    members.forEach(member => {
      breakdown[member.status] = (breakdown[member.status] || 0) + 1;
    });
    return breakdown;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Loading type="stats" />
        <Loading />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadReportsData} />;
  }

  const statusBreakdown = getStatusBreakdown();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">
            Church membership and attendance analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleExportReport}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" size={16} />
            <span>Export Report</span>
          </Button>
          <Button
            variant="ghost"
            onClick={loadReportsData}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={memberStats?.total || 0}
          icon="Users"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Members"
          value={memberStats?.active || 0}
          icon="UserCheck"
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceStats?.attendanceRate || 0}%`}
          icon="TrendingUp"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Total Records"
          value={attendanceStats?.totalRecords || 0}
          icon="Calendar"
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Member Status Breakdown */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Member Status Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(statusBreakdown).map(([status, count]) => (
            <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Recent Activity Summary
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <ApperIcon name="UserPlus" size={16} className="text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">New Members</div>
                <div className="text-sm text-gray-600">
                  {memberStats?.newMembers || 0} new members joined recently
                </div>
              </div>
            </div>
            <div className="text-lg font-semibold text-green-600">
              {memberStats?.newMembers || 0}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <ApperIcon name="Eye" size={16} className="text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Visitors</div>
                <div className="text-sm text-gray-600">
                  {memberStats?.visitors || 0} visitors in the system
                </div>
              </div>
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {memberStats?.visitors || 0}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <ApperIcon name="Calendar" size={16} className="text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Attendance</div>
                <div className="text-sm text-gray-600">
                  {attendanceStats?.presentCount || 0} present out of {attendanceStats?.totalRecords || 0} records
                </div>
              </div>
            </div>
            <div className="text-lg font-semibold text-purple-600">
              {attendanceStats?.attendanceRate || 0}%
            </div>
          </div>
        </div>
      </Card>

      {/* Export Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Export Data
            </h3>
            <p className="text-gray-600">
              Export your church data for external analysis or backup purposes.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleExportReport}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" size={16} />
            <span>Export Now</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Reports;