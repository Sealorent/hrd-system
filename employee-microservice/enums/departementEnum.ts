// enums/departementEnum.ts

export enum Department {
    HR = "Human Resources",
    IT = "Information Technology",
    Finance = "Finance",
    Marketing = "Marketing",
    Operations = "Operations"
  }
  
  // Map of departments to their respective positions
export const departmentPositions: Record<Department, string[]> = {
    [Department.HR]: [
      "HR Manager",
      "Recruiter",
      "Training Specialist",
      "HR Coordinator"
    ],
    [Department.IT]: [
      "Software Developer",
      "System Administrator",
      "Network Engineer",
      "IT Support Specialist"
    ],
    [Department.Finance]: [
      "Financial Analyst",
      "Accountant",
      "Auditor",
      "Payroll Specialist"
    ],
    [Department.Marketing]: [
      "Marketing Manager",
      "Content Writer",
      "SEO Specialist",
      "Social Media Coordinator"
    ],
    [Department.Operations]: [
      "Operations Manager",
      "Project Coordinator",
      "Quality Assurance Analyst",
      "Logistics Specialist"
    ]
  };
  