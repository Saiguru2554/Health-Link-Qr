import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Check, Eye, EyeOff, Upload } from "lucide-react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "",
    specialty: "",
    gender: "",
    profileImage: null as File | null,
    imagePreview: "",
    dob: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      phone: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to generate a patient ID
  const generatePatientId = () => {
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 digit random number
    return `P${timestamp}${randomNum}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
      // Reset specialty if not a doctor
      specialty: value !== "doctor" ? "" : formData.specialty,
    });
  };

  const handleSpecialtyChange = (value: string) => {
    setFormData({
      ...formData,
      specialty: value,
    });
  };

  const handleGenderChange = (value: string) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target) {
          setFormData({
            ...formData,
            profileImage: file,
            imagePreview: event.target.result as string,
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password || !formData.role || !formData.gender) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.role === "doctor" && !formData.specialty) {
      toast({
        title: "Error",
        description: "Please select a specialty",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Generate patient ID for patients
    const patientId = formData.role === "patient" ? generatePatientId() : undefined;
    
    // Store user data in localStorage
    const userData = {
      username: formData.role === "patient" ? patientId : formData.username,
      patient_id: patientId, // Will be undefined for non-patients
      card_number: patientId, // Will be undefined for non-patients
      name: `${formData.firstName} ${formData.lastName}`,
      role: formData.role,
      email: formData.email,
      specialty: formData.specialty,
      gender: formData.gender,
      photo: formData.imagePreview || null,
      password: formData.password, // Store password for login
      dob: formData.dob || "", // Add DOB if present
      bloodGroup: formData.bloodGroup || "",
      emergencyContact: formData.emergencyContact || {},
    };

    // Check if username/patient_id already exists
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    if (existingUsers.some((user: any) => user.username === userData.username)) {
      toast({
        title: "Error",
        description: formData.role === "patient" 
          ? "Failed to generate unique patient ID. Please try again." 
          : "Username already exists. Please choose a different username.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Store in registered users list
    existingUsers.push(userData);
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
    
    // Show success message with patient ID for patients
    setTimeout(() => {
      if (formData.role === "patient") {
        toast({
          title: "Registration successful",
          description: `Your Patient ID and Card Number is: ${patientId}. Please save this number for future reference.`,
          duration: 6000, // Show for 6 seconds
        });
      } else {
        toast({
          title: "Registration successful",
          description: "You can now log in with your credentials",
        });
      }
      setIsLoading(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="h-10"
          />
        </div>
        
        <div className="space-y-2 flex-1">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="h-10"
          />
        </div>
      </div>
      
      {formData.role !== "patient" && (
        <div className="space-y-2">
          <Label htmlFor="username">Username *</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            className="h-10"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gender">Gender *</Label>
        <Select value={formData.gender} onValueChange={handleGenderChange}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            className="h-10 pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-2 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select value={formData.role} onValueChange={handleRoleChange}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patient">Patient</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.role === "doctor" && (
        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty *</Label>
          <Select value={formData.specialty} onValueChange={handleSpecialtyChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select your specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="dermatology">Dermatology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
              <SelectItem value="psychiatry">Psychiatry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="profileImage">Profile Photo</Label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              id="profileImage"
              type="file"
              accept="image/*"
              className="h-10 hidden"
              onChange={handleImageChange}
            />
            <Button 
              type="button" 
              variant="outline"
              className="w-full h-10"
              onClick={() => document.getElementById("profileImage")?.click()}
            >
              <Upload size={16} className="mr-2" />
              {formData.profileImage ? "Change Photo" : "Upload Photo"}
            </Button>
          </div>
          
          {formData.imagePreview && (
            <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-healthcare-primary">
              <img
                src={formData.imagePreview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 mt-4 bg-healthcare-primary hover:bg-healthcare-secondary text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        ) : (
          <span className="flex items-center">
            <Check className="mr-2" size={20} />
            Create Account
          </span>
        )}
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-healthcare-primary hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;
