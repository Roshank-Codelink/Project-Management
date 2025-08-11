"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ 
  variant = "outline", 
  size = "sm", 
  className = "",
  children 
}: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="w-4 h-4 mr-2" />
      {children || "Logout"}
    </Button>
  );
}
