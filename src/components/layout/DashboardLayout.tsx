import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, Menu, X, Plus } from "lucide-react";
import PatientDashboard from "../dashboard/PatientDashboard";
import DoctorDashboard from "../dashboard/DoctorDashboard";
import ReportEntryDashboard from "../dashboard/ReportEntryDashboard";

const DashboardLayout = () => {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("DashboardLayout mounted");
    const userData = localStorage.getItem("healthcareUser");
    console.log("User data from localStorage:", userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user data:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("healthcareUser");
        navigate("/login");
      }
    } else {
      console.log("No user data found, redirecting to login");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("healthcareUser");
    navigate("/login");
  };

  if (!user) {
    console.log("No user data in state, rendering null");
    return null;
  }

  console.log("Rendering dashboard for role:", user.role);
  
  const getDashboardByRole = () => {
    switch (user.role) {
      case "patient":
        return <PatientDashboard />;
      case "doctor":
        return <DoctorDashboard />;
      case "report_entry":
        return <ReportEntryDashboard />;
      default:
        console.error("Unknown role:", user.role);
        return <div>Unknown role</div>;
    }
  };

  const getRoleTitle = () => {
    switch (user.role) {
      case "patient":
        return "Patient Dashboard";
      case "doctor":
        return "Doctor Dashboard";
      case "report_entry":
        return "Medical Reports";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/medical-bg.jpg')" }}>
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-sm p-4 shadow-sm md:hidden sticky top-0 z-20">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
              <h1 className="text-lg font-medium">{getRoleTitle()}</h1>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-healthcare-primary text-white text-sm">
                {user.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white/80 backdrop-blur-sm shadow-md p-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-healthcare-primary text-white">
                    {user.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role.replace("_", " ")}</p>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <Button 
                variant="destructive" 
                className="w-full mt-2"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </header>

        {/* Desktop Layout */}
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex md:flex-col md:w-64 bg-white/80 backdrop-blur-sm shadow-sm p-6 border-r">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-blue-500 text-white rounded">
                <Plus size={24} />
              </div>
              <span className="text-xl font-medium">Health QR Link</span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-4">{getRoleTitle()}</h2>
              
              <div className="space-y-1">
                {/* Menu items could be added here */}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback className="bg-healthcare-primary text-white">
                  {user.name.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role.replace("_", " ")}</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6 bg-white/50 backdrop-blur-sm">
            {getDashboardByRole()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
