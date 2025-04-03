import { Activity } from "./activity";
import { Earning } from "./earning";
import { FreelancerProfile } from "./freelancerProfile";
import { Project } from "./project ";

export const freelancerProfile: FreelancerProfile = {
  name: "Priyantha Silva",
  avatar: "/api/placeholder/200/200",
  rating: 4.7,
  totalEarnings: 25600,
  completedProjects: 42,
  skills: [
    { name: "Web Development", endorsements: 15, proficiency: 90 },
    { name: "React.js", endorsements: 12, proficiency: 85 },
    { name: "Node.js", endorsements: 10, proficiency: 80 },
    { name: "Database Design", endorsements: 8, proficiency: 75 },
  ],
};

export const activeProjects: Project[] = [
  {
    id: "proj1",
    title: "E-commerce Website Redesign",
    status: "In Progress",
    client: "Colombo Tech Solutions",
    earnings: 1200,
    deadline: "2024-05-15",
  },
  {
    id: "proj2",
    title: "Mobile App Backend",
    status: "Pending",
    client: "StartUp Lanka",
    earnings: 900,
    deadline: "2024-06-01",
  },
];

export const earningsData: Earning[] = [
  { month: "Jan", amount: 2100 },
  { month: "Feb", amount: 2400 },
  { month: "Mar", amount: 1800 },
  { month: "Apr", amount: 2700 },
];

export const activityFeed: Activity[] = [
  {
    id: "act1",
    type: "project",
    description: 'New project "E-commerce Website" assigned',
    timestamp: "2024-04-10T10:30:00Z",
  },
  {
    id: "act2",
    type: "payment",
    description: "Received $1500 for completed project",
    timestamp: "2024-04-05T15:45:00Z",
  },
];
