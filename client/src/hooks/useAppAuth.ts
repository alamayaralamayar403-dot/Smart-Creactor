import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export function useAppAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // التحقق من المصادقة من localStorage
    const activated = localStorage.getItem("activated");
    const activationTime = localStorage.getItem("activationTime");

    if (activated === "true" && activationTime) {
      // تحقق من أن المصادقة لم تنتهِ صلاحيتها (صالحة لمدة 30 يوم)
      const activationDate = new Date(activationTime);
      const now = new Date();
      const daysDiff = (now.getTime() - activationDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff < 30) {
        setIsAuthenticated(true);
      } else {
        // انتهت الصلاحية
        localStorage.removeItem("activated");
        localStorage.removeItem("activationTime");
        localStorage.removeItem("userEmail");
        setLocation("/auth");
      }
    } else if (window.location.pathname !== "/auth" && window.location.pathname !== "/") {
      // إذا لم يكن مصرحاً وحاول الوصول لصفحة محمية
      setLocation("/auth");
    }

    setIsLoading(false);
  }, [setLocation]);

  const logout = () => {
    localStorage.removeItem("activated");
    localStorage.removeItem("activationTime");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setLocation("/auth");
  };

  return { isAuthenticated, isLoading, logout };
}
