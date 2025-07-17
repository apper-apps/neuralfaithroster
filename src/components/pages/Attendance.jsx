import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useMembers } from "@/hooks/useMembers";
import { useAttendance } from "@/hooks/useAttendance";
import AttendanceForm from "@/components/organisms/AttendanceForm";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Attendance = () => {
  const { members, loading: membersLoading, error: membersError } = useMembers();
  const { attendance, loading: attendanceLoading, error: attendanceError, createAttendance } = useAttendance();
  const [showForm, setShowForm] = useState(false);
  const [eventFilter, setEventFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const handleRecordAttendance = async (attendanceData) => {
    await createAttendance(attendanceData);
    setShowForm(false);
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.Id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : "Unknown Member";
  };

  const filteredAttendance = attendance.filter(record => {
    let matchesEvent = eventFilter === "all" || record.eventType === eventFilter;
    let matchesDate = true;
    
    if (dateFilter === "today") {
      matchesDate = format(new Date(record.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    } else if (dateFilter === "week") {
      const recordDate = new Date(record.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = recordDate >= weekAgo;
    }
    
    return matchesEvent && matchesDate;
  });

  const loading = membersLoading || attendanceLoading;
  const error = membersError || attendanceError;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

  if (showForm) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Record Attendance</h1>
            <p className="text-gray-600">Mark member attendance for church events</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowForm(false)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Back to Attendance</span>
          </Button>
        </div>

        <AttendanceForm
          members={members}
          onSave={handleRecordAttendance}
          onCancel={() => setShowForm(false)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track member attendance for church events</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Record Attendance</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-48"
            >
              <option value="all">All Events</option>
              <option value="sunday service">Sunday Service</option>
              <option value="wednesday service">Wednesday Service</option>
              <option value="bible study">Bible Study</option>
              <option value="special event">Special Event</option>
              <option value="conference">Conference</option>
              <option value="youth meeting">Youth Meeting</option>
            </Select>
            
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-32"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </Select>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredAttendance.length} attendance records
          </div>
        </div>
      </Card>

      {/* Attendance Records */}
      {filteredAttendance.length === 0 ? (
        <Empty
          title="No attendance records found"
          message="Start by recording attendance for your church events."
          icon="Calendar"
          action={() => setShowForm(true)}
          actionText="Record Attendance"
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getMemberName(record.memberId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {record.eventType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(record.date), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.present
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <ApperIcon 
                          name={record.present ? "Check" : "X"} 
                          size={12} 
                          className="mr-1"
                        />
                        {record.present ? "Present" : "Absent"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Attendance;