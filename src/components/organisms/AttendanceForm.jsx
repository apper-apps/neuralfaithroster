import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const AttendanceForm = ({ members, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    memberId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    eventType: "sunday service",
    present: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.memberId) {
      newErrors.memberId = "Please select a member";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.eventType) {
      newErrors.eventType = "Event type is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const attendanceData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        memberId: parseInt(formData.memberId)
      };
      
      await onSave(attendanceData);
      toast.success("Attendance recorded successfully!");
      
      // Reset form
      setFormData({
        memberId: "",
        date: format(new Date(), "yyyy-MM-dd"),
        eventType: "sunday service",
        present: true
      });
    } catch (error) {
      toast.error("Failed to record attendance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            name="memberId"
            label="Member"
            value={formData.memberId}
            onChange={handleChange}
            error={errors.memberId}
            required
          >
            <option value="">Select a member</option>
            {members.map((member) => (
              <option key={member.Id} value={member.Id}>
                {member.firstName} {member.lastName}
              </option>
            ))}
          </Select>
          
          <Input
            name="date"
            label="Date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
          />
          
          <Select
            name="eventType"
            label="Event Type"
            value={formData.eventType}
            onChange={handleChange}
            error={errors.eventType}
            required
          >
            <option value="sunday service">Sunday Service</option>
            <option value="wednesday service">Wednesday Service</option>
            <option value="bible study">Bible Study</option>
            <option value="special event">Special Event</option>
            <option value="conference">Conference</option>
            <option value="youth meeting">Youth Meeting</option>
          </Select>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="present"
              name="present"
              checked={formData.present}
              onChange={handleChange}
              className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
            />
            <label htmlFor="present" className="text-sm font-medium text-gray-700">
              Member was present
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                <span>Recording...</span>
              </>
            ) : (
              <>
                <ApperIcon name="Check" size={16} />
                <span>Record Attendance</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AttendanceForm;