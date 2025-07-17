import { useState, useEffect } from "react";
import { attendanceService } from "@/services/api/attendanceService";

export const useAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await attendanceService.getAll();
      setAttendance(data);
    } catch (err) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const createAttendance = async (attendanceData) => {
    const newRecord = await attendanceService.create(attendanceData);
    setAttendance(prev => [...prev, newRecord]);
    return newRecord;
  };

  const updateAttendance = async (id, attendanceData) => {
    const updatedRecord = await attendanceService.update(id, attendanceData);
    setAttendance(prev => prev.map(a => a.Id === parseInt(id) ? updatedRecord : a));
    return updatedRecord;
  };

  const deleteAttendance = async (id) => {
    await attendanceService.delete(id);
    setAttendance(prev => prev.filter(a => a.Id !== parseInt(id)));
  };

  return {
    attendance,
    loading,
    error,
    loadAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
  };
};