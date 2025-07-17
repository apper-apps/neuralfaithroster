import membersData from "@/services/mockData/members.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create a copy of the data to avoid mutations
let members = [...membersData];

export const memberService = {
  // Get all members
  async getAll() {
    await delay(300);
    return [...members];
  },

  // Get member by ID
  async getById(id) {
    await delay(200);
    const member = members.find(m => m.Id === parseInt(id));
    if (!member) {
      throw new Error("Member not found");
    }
    return { ...member };
  },

  // Create new member
  async create(memberData) {
    await delay(400);
    const newMember = {
      ...memberData,
      Id: Math.max(...members.map(m => m.Id)) + 1
    };
    members.push(newMember);
    return { ...newMember };
  },

  // Update member
  async update(id, memberData) {
    await delay(350);
    const index = members.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Member not found");
    }
    
    const updatedMember = {
      ...members[index],
      ...memberData,
      Id: parseInt(id)
    };
    
    members[index] = updatedMember;
    return { ...updatedMember };
  },

  // Delete member
  async delete(id) {
    await delay(300);
    const index = members.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Member not found");
    }
    
    members.splice(index, 1);
    return { success: true };
  },

  // Search members
  async search(query) {
    await delay(250);
    if (!query.trim()) {
      return [...members];
    }
    
    const searchTerm = query.toLowerCase();
    return members.filter(member => 
      member.firstName.toLowerCase().includes(searchTerm) ||
      member.lastName.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm) ||
      member.phone.includes(searchTerm) ||
      member.status.toLowerCase().includes(searchTerm)
    );
  },

  // Get members by status
  async getByStatus(status) {
    await delay(200);
    return members.filter(member => 
      member.status.toLowerCase() === status.toLowerCase()
    );
  },

  // Get member statistics
  async getStats() {
    await delay(300);
    const stats = {
      total: members.length,
      active: members.filter(m => m.status === "active").length,
      newMembers: members.filter(m => m.status === "new member").length,
      visitors: members.filter(m => m.status === "visitor").length,
      inactive: members.filter(m => m.status === "inactive").length
    };
    return stats;
  }
};