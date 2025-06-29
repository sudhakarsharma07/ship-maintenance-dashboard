// Based on the Example JSON Mock Data from the PDF
export const initialUsers = [
  { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
  { id: "2", role: "Inspector", email: "inspector@entnt.in", password: "inspect123" },
  { id: "3", role: "Engineer", email: "engineer@entnt.in", password: "engine123" },
  { id: "4", role: "Engineer", email: "engineer2@entnt.in", password: "engine123" } // Added another engineer
];

export const initialShips = [
  { id: "s1", name: "Ever Given", imo: "9811000", flag: "Panama", status: "Active" },
  { id: "s2", name: "Maersk Alabama", imo: "9164263", flag: "USA", status: "Under Maintenance" },
  { id: "s3", name: "Cosco Shipping Aries", imo: "9783497", flag: "Hong Kong", status: "Active" }
];

export const initialComponents = [
  { id: "c1", shipId: "s1", name: "Main Engine", serialNumber: "ME-1234", installDate: "2020-01-10", lastMaintenanceDate: "2024-03-12" },
  { id: "c2", shipId: "s2", name: "Radar", serialNumber: "RAD-5678", installDate: "2021-07-18", lastMaintenanceDate: "2023-12-01" },
  { id: "c3", shipId: "s1", name: "Generator A", serialNumber: "GEN-A-001", installDate: "2020-01-10", lastMaintenanceDate: "2024-01-15" },
  { id: "c4", shipId: "s3", name: "Navigation System", serialNumber: "NAV-SYS-007", installDate: "2022-05-20", lastMaintenanceDate: "2024-02-20" }
];

export const initialJobs = [
  { 
    id: "j1", 
    componentId: "c1", 
    shipId: "s1", 
    type: "Inspection", 
    priority: "High", 
    status: "Open", 
    assignedEngineerId: "3", 
    scheduledDate: "2025-05-05",
    description: "Routine inspection of Main Engine."
  },
  { 
    id: "j2", 
    componentId: "c2", 
    shipId: "s2", 
    type: "Repair", 
    priority: "Medium", 
    status: "In Progress", 
    assignedEngineerId: "4", 
    scheduledDate: "2024-07-15", // Past date for "In Progress"
    description: "Repair faulty radar sensor."
  },
  { 
    id: "j3", 
    componentId: "c3", 
    shipId: "s1", 
    type: "Scheduled Maintenance", 
    priority: "Low", 
    status: "Completed", 
    assignedEngineerId: "3", 
    scheduledDate: "2024-01-15",
    completionDate: "2024-01-18",
    description: "Generator A annual service."
  },
  { 
    id: "j4", 
    componentId: "c4", 
    shipId: "s3", 
    type: "Inspection", 
    priority: "High", 
    status: "Open", 
    assignedEngineerId: null, // Unassigned
    scheduledDate: "2024-08-01",
    description: "Navigation system checkup."
  }
];