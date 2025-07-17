import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const MemberForm = ({ member, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    status: "visitor",
    joinDate: format(new Date(), "yyyy-MM-dd"),
    birthDate: "",
    notes: "",
    tags: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        email: member.email || "",
        phone: member.phone || "",
        address: member.address || "",
        status: member.status || "visitor",
        joinDate: member.joinDate ? format(new Date(member.joinDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        birthDate: member.birthDate ? format(new Date(member.birthDate), "yyyy-MM-dd") : "",
        notes: member.notes || "",
        tags: member.tags || []
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.joinDate) {
      newErrors.joinDate = "Join date is required";
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
      const memberData = {
        ...formData,
        joinDate: new Date(formData.joinDate).toISOString(),
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null
      };
      
      await onSave(memberData);
      toast.success(member ? "Member updated successfully!" : "Member added successfully!");
    } catch (error) {
      toast.error("Failed to save member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          
          <Input
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
          
          <Input
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          
          <Input
            name="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />
          
          <div className="md:col-span-2">
            <Input
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
          </div>
          
          <Select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
            error={errors.status}
          >
            <option value="visitor">Visitor</option>
            <option value="new member">New Member</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          
          <Input
            name="joinDate"
            label="Join Date"
            type="date"
            value={formData.joinDate}
            onChange={handleChange}
            error={errors.joinDate}
            required
          />
          
          <Input
            name="birthDate"
            label="Birth Date"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            error={errors.birthDate}
          />
          
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
              placeholder="Add any additional notes about this member..."
            />
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} />
                <span>{member ? "Update Member" : "Add Member"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MemberForm;