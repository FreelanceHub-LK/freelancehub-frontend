"use client";
import { signIn } from "next-auth/react";

interface SignInButtonProps {
  callbackUrl?: string;
  className?: string;
}

function SignInButton({
  callbackUrl = "/dashboard",
  className = "",
}: SignInButtonProps) {
  return (
    <button
      onClick={() =>
        signIn("google", { callbackUrl, prompt: "select_account" })
      }
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors w-full ${className}`}
    >
      <span>Sign in with Google</span>
    </button>
  );
}

export default SignInButton;
