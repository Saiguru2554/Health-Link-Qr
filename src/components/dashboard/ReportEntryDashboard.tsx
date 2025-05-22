
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
    
    // In a real app, this would be an API call to save the report
    toast({
      title: "Report Saved",
      description: `Medical report created for ${selectedPatient.name}`,
    });
    
    // Reset form after submission
    setReportForm({
      diagnosis: "",
      treatment: "",
      followUp: "",
      notes: ""
    });
  };

  const filteredPatients = searchTerm
    ? mockPatients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockPatients;

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Staff Profile */}
        <Card className="dashboard-card animate-fade-in">
          <CardHeader>
            <CardTitle>Staff Profile</CardTitle>
            <CardDescription>Medical Record Entry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-healthcare-primary">
                <AvatarImage src="https://randomuser.me/api/portraits/men/67.jpg" />
                <AvatarFallback className="bg-healthcare-primary text-white">
                  <User size={36} />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-gray-500">Medical Records Staff</p>
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
        <Card className="dashboard-card animate-fade-in md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 text-healthcare-primary" />
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
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 font-medium flex">
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
                        className={`p-3 flex cursor-pointer hover:bg-gray-50 border-t ${
                          selectedPatient?.id === patient.id ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="w-1/2 flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="bg-healthcare-primary text-white text-xs">
                              {patient.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {patient.name}
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
      <Card className="dashboard-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 text-healthcare-primary" />
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
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis *</Label>
                <Input
                  id="diagnosis"
                  name="diagnosis"
                  value={reportForm.diagnosis}
                  onChange={handleReportChange}
                  placeholder="Enter diagnosis"
                  required
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="followUp">Follow-up Recommendation</Label>
                <Select value={reportForm.followUp} onValueChange={handleFollowUpChange}>
                  <SelectTrigger>
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
                />
              </div>
              
              <Button type="submit" className="bg-healthcare-primary hover:bg-healthcare-secondary">
                <Plus className="mr-2 h-4 w-4" />
                Submit Report
              </Button>
            </form>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Please select a patient from the list above to create a medical report
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportEntryDashboard;
