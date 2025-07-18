import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useMembers } from "@/hooks/useMembers";
import MemberCard from "@/components/organisms/MemberCard";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import MemberDetail from "@/components/organisms/MemberDetail";
import MemberTable from "@/components/organisms/MemberTable";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const Members = () => {
  const navigate = useNavigate();
  const {
    members,
    setMembers,
    loading,
    error,
    loadMembers,
    searchMembers,
    deleteMember
  } = useMembers();
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");

const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      try {
        const searchResults = await searchMembers(value);
        // Group family members together in search results
        const familyGroups = {};
        searchResults.forEach(member => {
          const familyKey = member.familyId || `individual_${member.Id}`;
          if (!familyGroups[familyKey]) {
            familyGroups[familyKey] = [];
          }
          familyGroups[familyKey].push(member);
        });
        
        // Flatten grouped results while maintaining family proximity
        const groupedResults = Object.values(familyGroups).flat();
        setMembers(groupedResults);
      } catch (error) {
        console.error("Search failed:", error);
      }
    } else {
      loadMembers();
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleDeleteMember = async (member) => {
    if (window.confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
      try {
        await deleteMember(member.Id);
        toast.success("Member deleted successfully");
        setSelectedMember(null);
      } catch (err) {
        toast.error("Failed to delete member");
      }
    }
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
  };

  const handleEditMember = (member) => {
    navigate(`/members/${member.Id}/edit`);
  };

  const handleExportMembers = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,Status,Join Date\n" +
      members.map(member => 
        `"${member.firstName} ${member.lastName}","${member.email}","${member.phone}","${member.status}","${member.joinDate}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "members.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Members exported successfully");
  };

  const filteredMembers = members.filter(member => {
    if (statusFilter === "all") return true;
    return member.status === statusFilter;
  });

  if (selectedMember) {
    return (
      <MemberDetail
        member={selectedMember}
        onEdit={handleEditMember}
        onClose={() => setSelectedMember(null)}
      />
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
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600">Manage your church membership directory</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportMembers}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" size={16} />
            <span>Export</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/members/new")}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="UserPlus" size={16} />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
<SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search members and families..."
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">All Status</option>
              <option value="visitor">Visitor</option>
              <option value="new member">New Member</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
            
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === "table" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-r-none"
              >
                <ApperIcon name="Table" size={16} />
              </Button>
              <Button
                variant={viewMode === "cards" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="rounded-l-none"
              >
                <ApperIcon name="Grid3x3" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <Loading type={viewMode === "table" ? "table" : "cards"} />
      ) : error ? (
        <Error message={error} onRetry={loadMembers} />
      ) : filteredMembers.length === 0 ? (
        <Empty
          title="No members found"
          message={searchTerm ? "No members match your search criteria." : "Get started by adding your first member."}
          icon="Users"
          action={() => navigate("/members/new")}
          actionText="Add Member"
        />
      ) : viewMode === "table" ? (
        <MemberTable
          members={filteredMembers}
          onView={handleViewMember}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.Id}
              member={member}
              onClick={() => handleViewMember(member)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Members;