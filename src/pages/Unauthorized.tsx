
import { Button } from "@/components/ui/button";
import { Home, ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen healthcare-gradient flex flex-col items-center justify-center p-4">
      <div className="auth-card flex flex-col items-center">
        <ShieldX className="text-red-500 h-20 w-20 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-center">
          You don't have permission to access this page.
        </p>
        <Button 
          className="bg-healthcare-primary hover:bg-healthcare-secondary"
          onClick={() => navigate("/")}
        >
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
