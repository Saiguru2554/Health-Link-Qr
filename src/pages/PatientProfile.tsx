
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, User } from "lucide-react";
import PDFGenerator from "@/components/utils/PDFGenerator";

const PatientProfile = () => {
  const { username } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch patient data
    // For now, we'll simulate this with localStorage
    setLoading(true);
    
    // Simulate API fetch delay
    setTimeout(() => {
      // Mock patient data - in a real app, this would come from your API
      const mockPatient = {
        name: "Sarah Johnson",
        username: username,
        id: "P-2023-4567",
        photo: "https://randomuser.me/api/portraits/women/44.jpg",
        reports: [
          {
            id: "MR-2023-6789",
            date: "2023-12-15",
            doctorName: "Dr. John Smith",
            diagnosis: "Seasonal Allergies",
            treatment: "Prescribed antihistamines and nasal spray",
            followUp: "2 weeks",
            notes: "Patient reported improvement after initial medication. Continue treatment as prescribed."
          }
        ]
      };
      
      setPatient(mockPatient);
      setLoading(false);
    }, 500);
  }, [username]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen healthcare-gradient">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="text-center">
            Loading patient data...
          </div>
        </Card>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen healthcare-gradient">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="text-center">
            Patient not found
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen healthcare-gradient p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card id="patient-profile" className="shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 text-healthcare-primary" size={24} />
              Patient Profile
            </CardTitle>
            <CardDescription>
              Patient information and medical records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32 border-4 border-healthcare-primary">
                    <AvatarImage src={patient.photo} />
                    <AvatarFallback className="bg-healthcare-primary text-white">
                      <User size={36} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{patient.name}</h3>
                    <p className="text-gray-500">Patient ID: {patient.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h3 className="text-lg font-semibold mb-2">Latest Medical Report</h3>
                <Card id="medical-report" className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Report ID: {patient.reports[0].id}</h3>
                        <span className="text-sm text-gray-500">
                          {patient.reports[0].date}
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Doctor</p>
                          <p>{patient.reports[0].doctorName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Diagnosis</p>
                          <p>{patient.reports[0].diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Treatment</p>
                          <p>{patient.reports[0].treatment}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Follow-up</p>
                          <p>{patient.reports[0].followUp}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm text-gray-500">Notes</p>
                        <p>{patient.reports[0].notes}</p>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <PDFGenerator
                          contentId="medical-report"
                          filename="medical-report"
                          label="Download Report"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientProfile;
