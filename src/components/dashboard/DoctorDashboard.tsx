import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PDFGenerator from "../utils/PDFGenerator";
import { 
  Circle, 
  FileText, 
  Search, 
  User, 
  Users,
  Building2,
  Stethoscope,
  BadgeAlert
} from "lucide-react";

// Sample medical reports data
const mockMedicalReports = [
  {
    id: "MR-2023-1234",
    date: "2023-06-15",
    doctorName: "Dr. Sarah Wilson",
    diagnosis: "Common Cold",
    treatment: "Prescribed cold medicine and rest",
    followUp: "None required",
    notes: "Patient should recover within a week with proper rest."
  },
  {
    id: "MR-2023-4567",
    date: "2023-09-22",
    doctorName: "Dr. Michael Brown",
    diagnosis: "Sprained Ankle",
    treatment: "Ice pack application, compression bandage, and pain medication",
    followUp: "1 week",
    notes: "Avoid strenuous activities and keep the foot elevated."
  },
  {
    id: "MR-2023-6789",
    date: "2023-12-15",
    doctorName: "Dr. John Smith",
    diagnosis: "Seasonal Allergies",
    treatment: "Prescribed antihistamines and nasal spray",
    followUp: "2 weeks",
    notes: "Patient reported improvement after initial medication. Continue treatment as prescribed."
  }
];

// Function to initialize mock data in localStorage
const initializeMockData = () => {
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
  let hasUpdated = false;

  const updatedUsers = registeredUsers.map((user: any) => {
    if (user.role === "patient" && !user.medicalReports) {
      hasUpdated = true;
      // Randomly assign 1-3 medical reports to each patient
      const numReports = Math.floor(Math.random() * 3) + 1;
      const patientReports = mockMedicalReports
        .slice(0, numReports)
        .map((report, index) => ({
          ...report,
          id: `MR-${user.username}-${index + 1}`, // Create unique report IDs
          date: new Date(Date.now() - (index * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] // Dates spread over last 3 months
        }));
      
      return {
        ...user,
        medicalReports: patientReports
      };
    }
    return user;
  });

  if (hasUpdated) {
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
  }
};

const DoctorDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  
  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    
    // Get doctor data
    const userData = localStorage.getItem("healthcareUser");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Get registered patients
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const patientUsers = registeredUsers.filter((user: any) => user.role === "patient");
    setPatients(patientUsers);
  }, []);

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    if (patient.medicalReports && patient.medicalReports.length > 0) {
      setSelectedReport(patient.medicalReports[0]);
    } else {
      setSelectedReport(null);
    }
  };

  const filteredPatients = searchTerm
    ? patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : patients;

  if (!user) return null;

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#E8F5E9] to-[#F3E5F5]">
      {/* Doctor Profile - Full Width */}
      <Card className="dashboard-card animate-fade-in hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm border-2 border-[#4CAF50]/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#2196F3] to-[#4CAF50] bg-clip-text text-transparent">
            Doctor Profile
          </CardTitle>
          <CardDescription className="text-base">
            Your medical profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Left Side - Photo */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative group">
                {/* Outer glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#4CAF50] via-[#2196F3] to-[#4CAF50] rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition-all duration-500"></div>
                
                {/* Inner glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] rounded-2xl opacity-50 group-hover:opacity-75 blur-md transition-all duration-500"></div>
                
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 rounded-2xl backdrop-blur-sm"></div>
                
                {/* Doctor Image */}
                <div className="relative hover:translate-y-[-10px] transition-transform duration-500">
                  <div className="w-48 h-60 relative rounded-2xl ring-4 ring-white/80 ring-offset-4 ring-offset-[#E3F2FD] overflow-hidden transition-all duration-500 group-hover:ring-offset-8">
                    {user.photo ? (
                      <img 
                        src={user.photo} 
                        alt={user.name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2196F3] to-[#4CAF50]">
                        <User size={48} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#4CAF50] rounded-full opacity-75 hover:translate-y-[-5px] transition-transform duration-300"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#2196F3] rounded-full opacity-75 hover:translate-y-[-5px] transition-transform duration-300"></div>
                </div>
              </div>

              {/* Doctor Name */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#1B5E20]">{user.name}</h3>
              </div>
            </div>

            {/* Right Side - Info */}
            <div className="flex-1 w-full md:max-w-md">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-inner h-full">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BadgeAlert className="h-5 w-5 min-w-[20px] text-[#2196F3]" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[#2E7D32] font-medium block">Doctor ID:</span>
                      <span className="font-semibold text-[#1B5E20] block truncate">{user.username}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 min-w-[20px] text-[#2196F3]" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[#2E7D32] font-medium block">Department:</span>
                      <span className="font-semibold text-[#1B5E20] block truncate">{user.department || "General"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-5 w-5 min-w-[20px] text-[#2196F3]" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[#2E7D32] font-medium block">Specialization:</span>
                      <span className="font-semibold text-[#1B5E20] block truncate">{user.type || user.specialization || "General Physician"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Search - Full Width */}
      <Card className="dashboard-card animate-fade-in hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm border-2 border-[#2196F3]/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold flex items-center text-[#1565C0]">
            <Search className="mr-3 text-[#2196F3]" />
            Patient Search
          </CardTitle>
          <CardDescription className="text-base text-[#1976D2]">
            Find patient records and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by patient name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-[#2196F3]/20 focus:border-[#2196F3] transition-all duration-300"
              />
              <Search className="absolute left-3 top-4 h-5 w-5 text-[#2196F3]" />
            </div>
            
            <div className="bg-white/90 rounded-xl shadow-sm overflow-hidden border-2 border-[#2196F3]/10">
              <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] p-4 font-bold text-[#1565C0] flex">
                <div className="w-1/3">Patient</div>
                <div className="w-1/3">ID</div>
                <div className="w-1/3">Email</div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div 
                      key={patient.username}
                      onClick={() => handlePatientSelect(patient)}
                      className={`p-4 flex cursor-pointer hover:bg-[#E3F2FD] border-t transition-colors duration-200 ${
                        selectedPatient?.username === patient.username ? "bg-[#E3F2FD]" : ""
                      }`}
                    >
                      <div className="w-1/3 flex items-center">
                        <Avatar className="h-8 w-8 mr-3 border-2 border-[#2196F3]/20">
                          <AvatarImage src={patient.photo} />
                          <AvatarFallback className="bg-gradient-to-br from-[#2196F3] to-[#64B5F6] text-white text-xs">
                            {patient.name.split(" ").map((n: string) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-[#1565C0]">{patient.name}</span>
                      </div>
                      <div className="w-1/3 flex items-center font-medium text-[#1976D2]">{patient.username}</div>
                      <div className="w-1/3 flex items-center text-[#1976D2]">{patient.email}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[#1976D2] font-medium">
                    No patients found
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Report - Only show when a patient is selected */}
      {selectedPatient && (
        <Card className="dashboard-card animate-fade-in hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm border-2 border-[#4CAF50]/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold flex items-center text-[#1B5E20]">
                  <FileText className="mr-3 text-[#4CAF50]" />
                  Patient Report
                </CardTitle>
                <CardDescription className="text-base text-[#2E7D32]">
                  {selectedPatient.name} ({selectedPatient.username})
                </CardDescription>
              </div>
              <PDFGenerator
                contentId="patient-report"
                filename={`report-${selectedReport?.id || 'patient'}`}
                label="Download Report"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-[#E8F5E9] p-1 rounded-lg">
                <TabsTrigger 
                  value="info"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32] data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Patient Info
                </TabsTrigger>
                <TabsTrigger 
                  value="reports"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32] data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Medical Reports
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                    <Avatar className="h-24 w-24 border-4 border-[#4CAF50]/20">
                      <AvatarImage src={selectedPatient.photo} />
                      <AvatarFallback className="bg-gradient-to-br from-[#2196F3] to-[#4CAF50] text-white text-2xl">
                        {selectedPatient.name.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-[#1B5E20]">{selectedPatient.name}</h3>
                      <div className="text-lg text-[#2E7D32]">
                        {selectedPatient.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Circle className="h-3 w-3 mr-2 text-[#4CAF50] fill-[#4CAF50]" />
                        <span className="text-[#2E7D32] font-medium">Active Patient</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-inner">
                      <p className="text-sm font-medium text-[#2E7D32] mb-1">Patient ID</p>
                      <p className="text-lg font-semibold text-[#1B5E20]">{selectedPatient.username}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-inner">
                      <p className="text-sm font-medium text-[#2E7D32] mb-1">Email</p>
                      <p className="text-lg font-semibold text-[#1B5E20]">{selectedPatient.email}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reports">
                {selectedPatient.medicalReports && selectedPatient.medicalReports.length > 0 ? (
                  <div className="space-y-6">
                    {selectedReport && (
                      <div className="space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold text-[#1B5E20]">Report ID: {selectedReport.id}</h3>
                          <span className="text-base text-[#2E7D32] font-medium">{selectedReport.date}</span>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-inner">
                            <p className="text-sm font-medium text-[#2E7D32] mb-1">Diagnosis</p>
                            <p className="text-lg text-[#1B5E20]">{selectedReport.diagnosis}</p>
                          </div>
                          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-inner">
                            <p className="text-sm font-medium text-[#2E7D32] mb-1">Treatment</p>
                            <p className="text-lg text-[#1B5E20]">{selectedReport.treatment}</p>
                          </div>
                          <div className="md:col-span-2 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-inner">
                            <p className="text-sm font-medium text-[#2E7D32] mb-1">Follow-up</p>
                            <p className="text-lg text-[#1B5E20]">{selectedReport.followUp}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-inner">
                          <p className="text-sm font-medium text-[#2E7D32] mb-1">Notes</p>
                          <p className="text-lg text-[#1B5E20]">{selectedReport.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#2E7D32] font-medium bg-white/80 backdrop-blur-sm rounded-xl">
                    No medical reports available for this patient
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorDashboard;
