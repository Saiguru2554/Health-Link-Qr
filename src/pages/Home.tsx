import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { backgroundConfig } from "@/assets/background";

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = localStorage.getItem("healthcareUser");
    
    if (userData) {
      navigate("/dashboard");
    }
    
    // Create floating shapes for the background
    const createShapes = () => {
      const floatingShapes = document.querySelector(".floating-shapes");
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
      const floatingShapes = document.querySelector(".floating-shapes");
      if (floatingShapes) {
        floatingShapes.innerHTML = "";
      }
    };
  }, [navigate]);
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${backgroundConfig.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: backgroundConfig.overlay.gradient,
        }}
      />
      
      <div className="floating-shapes"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-3 tracking-tight">
          Health QR Link
        </h1>
        <p className="text-xl text-gray-700">
          Your Trusted Healthcare Platform
        </p>
      </div>
      
      <div className="relative z-10 auth-card bg-white/95 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Home;
