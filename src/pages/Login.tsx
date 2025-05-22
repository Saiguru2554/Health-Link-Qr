import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = localStorage.getItem("healthcareUser");
    
    if (userData) {
      navigate("/dashboard");
    }
    
    // Create floating shapes for the background
    const createShapes = () => {
      const floatingShapes = document.querySelector(".login-floating-shapes");
      if (!floatingShapes) return;
      
      for (let i = 0; i < 15; i++) {
        const shape = document.createElement("div");
        shape.classList.add("shape");
        
        // Random size between 20px and 80px
        const size = Math.random() * 60 + 20;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        
        // Random position
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        
        // Random opacity
        shape.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        
        // Random animation duration
        shape.style.animationDuration = `${Math.random() * 20 + 10}s`;
        
        // Random animation delay
        shape.style.animationDelay = `${Math.random() * 5}s`;
        
        // Random background
        const hue = Math.random() * 60 + 180; // Blues and cyans
        shape.style.background = `hsla(${hue}, 70%, 70%, 0.2)`;
        
        // Add shape to container
        floatingShapes.appendChild(shape);
      }
    };
    
    // Call the function when component mounts
    setTimeout(createShapes, 100);
    
    // Clean up the shapes when unmounting
    return () => {
      const floatingShapes = document.querySelector(".login-floating-shapes");
      if (floatingShapes) {
        floatingShapes.innerHTML = "";
      }
    };
  }, [navigate]);
  
  return (
    <div className="min-h-screen creative-healthcare-bg flex flex-col items-center justify-center p-4 relative">
      <div className="login-floating-shapes floating-shapes"></div>
      
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-5xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">
          Health QR Link
        </h1>
        <p className="text-xl text-white/90 drop-shadow">
          Your Trusted Healthcare Platform
        </p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#0f766e]">Sign In</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
