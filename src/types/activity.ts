export interface Activity {
  id: string;
  type: "project" | "message" | "payment" | "review";
  description: string;
  timestamp: string;
}
