import attendanceData from "@/services/mockData/attendance.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create a copy of the data to avoid mutations
let attendance = [...attendanceData];

export const attendanceService = {
  // Get all attendance records
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  // Get attendance by ID
  async getById(id) {
    await delay(200);
    const record = attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  // Create new attendance record
  async create(attendanceData) {
    await delay(400);
    const newRecord = {
      ...attendanceData,
      Id: Math.max(...attendance.map(a => a.Id)) + 1
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  // Update attendance record
  async update(id, attendanceData) {
    await delay(350);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    const updatedRecord = {
      ...attendance[index],
      ...attendanceData,
      Id: parseInt(id)
    };
    
    attendance[index] = updatedRecord;
    return { ...updatedRecord };
  },

  // Delete attendance record
  async delete(id) {
    await delay(300);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    attendance.splice(index, 1);
    return { success: true };
  },

  // Get attendance by member ID
  async getByMemberId(memberId) {
    await delay(250);
    return attendance.filter(record => 
      record.memberId === parseInt(memberId)
    );
  },

  // Get attendance by date range
  async getByDateRange(startDate, endDate) {
    await delay(300);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });
  },

  // Get attendance statistics
  async getStats() {
    await delay(300);
    const totalRecords = attendance.length;
    const presentCount = attendance.filter(a => a.present).length;
    const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
    
    return {
      totalRecords,
      presentCount,
      absentCount: totalRecords - presentCount,
      attendanceRate: Math.round(attendanceRate)
    };
  }
};