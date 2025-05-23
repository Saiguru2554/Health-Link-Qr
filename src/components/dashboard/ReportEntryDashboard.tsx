import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Check, FileText, Plus, Search, User, Users } from "lucide-react";

// Declare addMedicalReport on the Window type for TypeScript
// @ts-ignore
window.addMedicalReport = window.addMedicalReport || (() => {});

declare global {
  interface Window {
    addMedicalReport: (patientUsername: string, report: any) => void;
  }
}

const mockPatients = [
  {
    id: "P-2023-4567",
    name: "Sarah Johnson",
    age: 34,
    gender: "Female"
  },
  {
    id: "P-2023-4568",
    name: "Michael Brown",
    age: 45,
    gender: "Male"
  },
  {
    id: "P-2023-4569",
    name: "Emily Davis",
    age: 28,
    gender: "Female"
  }
];

const ReportEntryDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [reportForm, setReportForm] = useState({
    diagnosis: "",
    treatment: "",
    followUp: "",
    notes: ""
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const userData = localStorage.getItem("healthcareUser");
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    // Reset form when selecting a new patient
    setReportForm({
      diagnosis: "",
      treatment: "",
      followUp: "",
      notes: ""
    });
  };

  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportForm({
      ...reportForm,
      [name]: value
    });
  };

  const handleFollowUpChange = (value: string) => {
    setReportForm({
      ...reportForm,
      followUp: value
    });
  };

  // Add: Allow report entry to actually update patient records
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      toast({
        title: "Error",
        description: "Please select a patient first",
        variant: "destructive",
      });
      return;
    }
    if (!reportForm.diagnosis || !reportForm.treatment) {
      toast({
        title: "Error",
        description: "Please fill in diagnosis and treatment",
        variant: "destructive",
      });
      return;
    }
    // Save report to patient
    const report = {
      id: `MR-${selectedPatient.id}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      doctorName: user?.role === 'doctor' ? user?.name : undefined,
      uploadedByRole: user?.role,
      diagnosis: reportForm.diagnosis,
      treatment: reportForm.treatment,
      followUp: reportForm.followUp,
      notes: reportForm.notes,
    };
    window.addMedicalReport(selectedPatient.id, report);
    toast({
      title: "Report Saved",
      description: `Medical report created for ${selectedPatient.name}`,
    });
    setReportForm({ diagnosis: "", treatment: "", followUp: "", notes: "" });
  };

  const filteredPatients = searchTerm
    ? mockPatients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockPatients;

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-emerald-100 animate-fade-in">
      <div className="p-8 bg-white/80 rounded-xl shadow-xl flex flex-col items-center">
        <User className="w-12 h-12 text-blue-400 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Loading Staff Profile...</h2>
        <p className="text-gray-500">Please wait while we load your dashboard.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 p-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Staff Profile */}
        <Card className="dashboard-card animate-fade-in shadow-lg border-2 border-blue-100">
          <CardHeader>
            <CardTitle>Staff Profile</CardTitle>
            <CardDescription>Medical Record Entry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-4 border-blue-300 shadow-md">
                <AvatarImage src="https://randomuser.me/api/portraits/men/67.jpg" />
                <AvatarFallback className="bg-blue-200 text-white">
                  <User size={36} />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-900">{user.name}</h3>
                <p className="text-blue-500">Medical Records Staff</p>
              </div>
              <div className="w-full pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Staff ID:</span>
                  <span>S-2023-7890</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Department:</span>
                  <span>Medical Records</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Reports Filed:</span>
                  <span>145</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Search */}
        <Card className="dashboard-card animate-fade-in md:col-span-2 shadow-lg border-2 border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 text-emerald-500 animate-pulse" />
              Patient Search
            </CardTitle>
            <CardDescription>
              Find patients to create or update reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by patient name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-emerald-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg shadow-sm"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <div className="border rounded-md overflow-hidden bg-white/80 shadow">
                <div className="bg-blue-50 p-3 font-medium flex">
                  <div className="w-1/2">Patient</div>
                  <div className="w-1/4">ID</div>
                  <div className="w-1/4">Age</div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <div 
                        key={patient.id}
                        onClick={() => handlePatientSelect(patient)}
                        className={`p-3 flex cursor-pointer hover:bg-emerald-50 border-t transition-colors duration-150 ${
                          selectedPatient?.id === patient.id ? "bg-blue-100 border-blue-200" : ""
                        }`}
                      >
                        <div className="w-1/2 flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="bg-emerald-400 text-white text-xs">
                              {patient.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-blue-900">{patient.name}</span>
                        </div>
                        <div className="w-1/4 flex items-center text-gray-600">{patient.id}</div>
                        <div className="w-1/4 flex items-center text-gray-600">{patient.age} yrs</div>
                      </div>
                    )) 
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No patients found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Create Medical Report */}
      <Card className="dashboard-card animate-fade-in shadow-xl border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 text-blue-500 animate-bounce" />
            Create Medical Report
          </CardTitle>
          <CardDescription>
            {selectedPatient 
              ? `Creating report for ${selectedPatient.name} (${selectedPatient.id})`
              : "Select a patient first"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedPatient ? (
            <form onSubmit={handleSubmitReport} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis *</Label>
                <Input
                  id="diagnosis"
                  name="diagnosis"
                  value={reportForm.diagnosis}
                  onChange={handleReportChange}
                  placeholder="Enter diagnosis"
                  required
                  className="rounded-lg border-2 border-blue-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment *</Label>
                <Input
                  id="treatment"
                  name="treatment"
                  value={reportForm.treatment}
                  onChange={handleReportChange}
                  placeholder="Enter prescribed treatment"
                  required
                  className="rounded-lg border-2 border-blue-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUp">Follow-up Recommendation</Label>
                <Select value={reportForm.followUp} onValueChange={handleFollowUpChange}>
                  <SelectTrigger className="rounded-lg border-2 border-blue-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
                    <SelectValue placeholder="Select follow-up period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 week">1 week</SelectItem>
                    <SelectItem value="2 weeks">2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="none">No follow-up needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={reportForm.notes}
                  onChange={handleReportChange}
                  placeholder="Enter any additional notes about the patient's condition"
                  rows={4}
                  className="rounded-lg border-2 border-blue-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <Button type="submit" className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-200">
                <Plus className="mr-2 h-4 w-4" />
                Submit Report
              </Button>
            </form>
          ) : (
            <div className="text-center py-10 text-gray-500 animate-fade-in">
              Please select a patient from the list above to create a medical report
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportEntryDashboard;
