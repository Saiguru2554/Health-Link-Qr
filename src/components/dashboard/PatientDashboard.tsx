import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import QRCodeGenerator from "../utils/QRCodeGenerator";
import PDFGenerator from "../utils/PDFGenerator";
import { FileText, User } from "lucide-react";
import { generatePatientQRData } from "@/utils/tokenGenerator";
import { useToast } from "@/components/ui/use-toast";
import EditProfileDialog from "./EditProfileDialog";

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

const PatientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const { toast } = useToast();
  
  const handleProfileUpdate = (updatedData: any) => {
    setUser(updatedData);
  };
  
  useEffect(() => {
    const userData = localStorage.getItem("healthcareUser");
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Add contact and address information for Sarah Anderson
      const enhancedUser = {
        ...parsedUser,
        phone: "+1 (555) 123-4567",
        address: "123 Medical Avenue, Healthcare District, New York, NY 10001",
        bloodGroup: "O+",
        emergencyContact: {
          name: "John Anderson",
          relation: "Spouse",
          phone: "+1 (555) 987-6543"
        },
        medicalReports: mockMedicalReports
      };
      setUser(enhancedUser);
      
      // Update the user data in localStorage to include medical reports
      localStorage.setItem("healthcareUser", JSON.stringify(enhancedUser));
      
      // Update in registeredUsers as well
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const updatedUsers = registeredUsers.map((u: any) => 
        u.username === enhancedUser.username ? enhancedUser : u
      );
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
      
      // Generate QR code data
      const qrData = generatePatientQRData(enhancedUser.username);
      
      // For development, use localhost with the correct port
      // In production, use the actual domain
      const baseUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5173'  // Default Vite development port
        : window.location.origin;
      
      // Create the URL with proper encoding
      const url = new URL(`/patient/${enhancedUser.username}`, baseUrl);
      url.searchParams.append('code', qrData);
      setQrUrl(url.toString());

      // Log the URL for debugging
      console.log('QR Code URL:', url.toString());
    }
  }, []);

  const VirtualCard = () => (
    <div className="relative w-full h-72 bg-gradient-to-br from-[#1a2e4c] to-[#2d4f83] rounded-xl p-6 overflow-hidden shadow-xl">
      {/* Medical cross pattern overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-20 h-20 text-[#4a90e2] opacity-10">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16 text-[#4a90e2] opacity-10">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </div>
      </div>
      
      <div className="relative z-10 h-full flex justify-between">
        {/* Left side - Photo and Card Title */}
        <div className="flex flex-col space-y-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/30 shadow-lg">
            <Avatar className="w-full h-full">
              <AvatarImage src={user.photo} className="object-cover" />
              <AvatarFallback className="bg-white text-[#1a2e4c]">
                <User size={40} />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-white text-xl font-bold tracking-wide">
            <p>HEALTH</p>
            <p>VIRTUAL</p>
            <p>CARD</p>
          </div>
        </div>

        {/* Middle - Patient Information */}
        <div className="flex-1 pl-8">
          <h2 className="text-2xl font-bold text-white mb-4">{user.name}</h2>
          <div className="space-y-2 text-[#e5e7eb]">
            <p>
              <span className="text-[#a3b1c6]">DOB: </span>
              01/01/1990
            </p>
            <p>
              <span className="text-[#a3b1c6]">Gender: </span>
              {user.gender || "Female"}
            </p>
            <p>
              <span className="text-[#a3b1c6]">Blood Group: </span>
              {user.bloodGroup}
            </p>
            <p>
              <span className="text-[#a3b1c6]">Phone: </span>
              {user.phone}
            </p>
            <p className="text-sm">
              <span className="text-[#a3b1c6]">Address: </span>
              {user.address}
            </p>
          </div>
          <div className="mt-6">
            <p className="font-mono text-xl tracking-[0.3em] text-white">
              {user.username.replace(/[^\d]/g, '').padStart(12, '0').match(/.{1,4}/g)?.join(' ')}
            </p>
          </div>
        </div>

        {/* Right side - QR Code */}
        <div className="flex flex-col items-center justify-center ml-4">
          <div className="bg-white p-3 rounded-lg">
            <QRCodeGenerator 
              value={qrUrl}
              size={120}
              fgColor="#000000"
              showText={false}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen healthcare-gradient flex flex-col items-center justify-center p-4">
      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Patient Dashboard</h1>
          <EditProfileDialog user={user} onProfileUpdate={handleProfileUpdate} />
        </div>

        {/* Patient Name and Details */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">{user.name}</h2>
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-6">
              <div>
                <p className="text-sm text-gray-500">Patient ID</p>
                <p className="font-medium text-gray-900">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="font-medium text-gray-900">{user.bloodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium text-gray-900">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{user.address}</p>
              </div>
              <div className="col-span-2 border-t border-gray-200 pt-4 mt-2">
                <p className="text-sm text-gray-500 font-medium mb-2">Emergency Contact</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{user.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relation</p>
                    <p className="font-medium text-gray-900">{user.emergencyContact.relation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="font-medium text-gray-900">{user.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Virtual Health Card */}
        <div className="space-y-4">
          <div id="virtual-card" className="card-container">
            <VirtualCard />
          </div>
          <div className="flex justify-end">
            <PDFGenerator
              contentId="virtual-card"
              filename="virtual-health-card"
              label="Download Card"
              isCard={true}
            />
          </div>

          {/* QR Code section */}
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>Your permanent patient profile QR code</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <QRCodeGenerator 
                    value={qrUrl}
                    size={240}
                    fgColor="#000000"
                  />
                </div>
                <div className="mt-4 space-y-2 w-full max-w-md">
                  <p className="text-sm text-gray-500 text-center">
                    Share this QR code to provide quick access to your medical profile
                  </p>
                  <p className="text-xs text-gray-400 break-all text-center">
                    {qrUrl}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medical Reports */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <FileText className="mr-2" />
                Medical Reports
              </CardTitle>
              <PDFGenerator
                contentId="all-medical-reports"
                filename="complete-medical-history"
                label="Download All Reports"
              />
            </div>
            <CardDescription>
              View your medical reports in chronological order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div id="all-medical-reports" className="space-y-6">
              {mockMedicalReports.map((report, index) => (
                <div key={report.id}>
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Report ID: {report.id}</h3>
                        <span className="text-sm text-gray-500">
                          {report.date}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Doctor</p>
                            <p className="text-gray-900">{report.doctorName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Diagnosis</p>
                            <p className="text-gray-900">{report.diagnosis}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Treatment</p>
                            <p className="text-gray-900">{report.treatment}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Follow-up</p>
                            <p className="text-gray-900">{report.followUp}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="text-gray-900">{report.notes}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {index < mockMedicalReports.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
