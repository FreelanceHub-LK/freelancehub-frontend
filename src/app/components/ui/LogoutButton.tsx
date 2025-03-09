"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  callbackUrl?: string;
  className?: string;
}

function LogoutButton({ callbackUrl = "/login", className = "" }: LogoutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl })}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
}

export default LogoutButton;