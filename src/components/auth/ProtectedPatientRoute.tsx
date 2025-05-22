import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedPatientRouteProps {
  children: React.ReactNode;
}

const ProtectedPatientRoute = ({ children }: ProtectedPatientRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { patientId } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthorization = () => {
      const userData = localStorage.getItem("healthcareUser");
      
      if (!userData) {
        toast({
          title: "Access Denied",
          description: "Please log in to view patient information",
          variant: "destructive",
        });
        return false;
      }

      const user = JSON.parse(userData);
      
      // Allow access if:
      // 1. User is the patient themselves
      // 2. User is a doctor
      // 3. User is medical staff
      const hasAccess = 
        (user.role === "patient" && user.username === patientId) ||
        user.role === "doctor" ||
        user.role === "report_entry";

      if (!hasAccess) {
        toast({
          title: "Unauthorized",
          description: "You don't have permission to view this patient's information",
          variant: "destructive",
        });
      }

      // Log access attempt
      logAccessAttempt(user.username, patientId, hasAccess);

      return hasAccess;
    };

    const logAccessAttempt = (userId: string, targetPatientId: string, wasGranted: boolean) => {
      // In a real app, this would be an API call to log the access attempt
      console.log(`Access attempt: User ${userId} tried to access patient ${targetPatientId}. Access ${wasGranted ? 'granted' : 'denied'}`);
    };

    setIsAuthorized(checkAuthorization());
    setLoading(false);
  }, [patientId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-healthcare-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedPatientRoute; 