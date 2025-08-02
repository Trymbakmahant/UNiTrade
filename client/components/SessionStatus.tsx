"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { sessionUtils } from "@/lib/session";
import { Clock } from "lucide-react";

export default function SessionStatus() {
  const { isAuthenticated } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) return;

    const updateTimeRemaining = () => {
      const remaining = sessionUtils.formatTimeRemaining();
      setTimeRemaining(remaining);
    };

    // Update immediately
    updateTimeRemaining();

    // Update every minute
    const interval = setInterval(updateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800 px-3 py-2 rounded-lg">
      <Clock className="w-4 h-4" />
      <span>Session expires in: {timeRemaining}</span>
    </div>
  );
}
