import { useState, useEffect } from "react";
import { memberService } from "@/services/api/memberService";

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await memberService.getAll();
      setMembers(data);
    } catch (err) {
      setError(err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const createMember = async (memberData) => {
    const newMember = await memberService.create(memberData);
    setMembers(prev => [...prev, newMember]);
    return newMember;
  };

  const updateMember = async (id, memberData) => {
    const updatedMember = await memberService.update(id, memberData);
    setMembers(prev => prev.map(m => m.Id === parseInt(id) ? updatedMember : m));
    return updatedMember;
  };

  const deleteMember = async (id) => {
    await memberService.delete(id);
    setMembers(prev => prev.filter(m => m.Id !== parseInt(id)));
  };

  const searchMembers = async (query) => {
    try {
      setLoading(true);
      setError("");
      const data = await memberService.search(query);
      setMembers(data);
    } catch (err) {
      setError(err.message || "Failed to search members");
    } finally {
      setLoading(false);
    }
  };

  return {
    members,
    loading,
    error,
    loadMembers,
    createMember,
    updateMember,
    deleteMember,
    searchMembers
  };
};