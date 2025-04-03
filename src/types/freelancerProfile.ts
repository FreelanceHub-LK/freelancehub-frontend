import { Skill } from "./skill";

export interface FreelancerProfile {
  name: string;
  avatar: string;
  rating: number;
  totalEarnings: number;
  completedProjects: number;
  skills: Skill[];
}
