import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { login, getUserProfile } from '@/services/api';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const user = await login(email, password);
      const profile = await getUserProfile(user.uid);
      toast({
        title: "Success",
        description: "Login successful",
      });
      if (profile.role === 'doctor') {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Invalid email or password",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#1a365d] font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 bg-[#f8fafc] border-[#e2e8f0] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#1a365d] font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 bg-[#f8fafc] border-[#e2e8f0] focus:border-[#3b82f6] focus:ring-[#3b82f6] pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-[#64748b] hover:text-[#475569] transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <LogIn className="mr-2" size={20} />
            Sign In
          </span>
        )}
      </Button>
      
      <div className="text-center">
        <p className="text-[#64748b]">
          Don't have an account?{" "}
          <a href="/register" className="text-[#3b82f6] hover:text-[#2563eb] font-medium">
            Create Account
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
