export interface Project {
  id: string;
  title: string;
  status: "In Progress" | "Completed" | "Pending";
  client: string;
  earnings: number;
  deadline: string;
}
