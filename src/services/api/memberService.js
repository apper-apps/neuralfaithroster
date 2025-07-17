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

// Search members (including family-aware search)
  async search(query) {
    await delay(250);
    if (!query.trim()) {
      return [...members];
    }
    
    const searchTerm = query.toLowerCase();
    const matchingMembers = members.filter(member => 
      member.firstName.toLowerCase().includes(searchTerm) ||
      member.lastName.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm) ||
      member.phone.includes(searchTerm) ||
      member.status.toLowerCase().includes(searchTerm)
    );

    // If searching by family name, include all family members
    const familyIds = new Set();
    matchingMembers.forEach(member => {
      if (member.familyId) {
        familyIds.add(member.familyId);
      }
    });

    const familyMembers = members.filter(member => 
      member.familyId && familyIds.has(member.familyId)
    );

    // Combine and deduplicate results
    const allResults = [...matchingMembers, ...familyMembers];
    const uniqueResults = allResults.filter((member, index, self) =>
      index === self.findIndex(m => m.Id === member.Id)
    );

    return uniqueResults;
  },

  // Get family members for a specific member
  async getFamilyMembers(memberId) {
    await delay(200);
    const member = members.find(m => m.Id === parseInt(memberId));
    if (!member || !member.familyId) {
      return [member].filter(Boolean);
    }
    
    return members.filter(m => m.familyId === member.familyId);
  },

  // Get family options for dropdowns
  async getFamilyOptions() {
    await delay(200);
    const families = {};
    members.forEach(member => {
      if (member.familyId) {
        const familyKey = `${member.familyId}_${member.lastName}`;
        if (!families[familyKey]) {
          families[familyKey] = {
            id: member.familyId,
            name: `${member.lastName} Family`,
            memberCount: 0
          };
        }
        families[familyKey].memberCount++;
      }
    });
    
    return Object.values(families);
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