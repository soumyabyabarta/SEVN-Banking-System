import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-body-md text-on-surface relative">
      
      {/* Logo - Fixed Top Left */}
      <Link to="/" className="absolute top-8 left-6 md:left-12 z-50 flex flex-col items-start gap-1">
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 md:h-12 w-auto drop-shadow-lg"
        >
          <path d="M10 10 L80 10 C85 10 90 15 90 20 L60 80 C57 85 52 90 47 90 H20 L40 60 L10 10 Z" fill="url(#auth_sevn_gradient)" />
          <path d="M10 10 L40 60 L10 10 Z" fill="#ffffff" fillOpacity="0.05" />
          <path d="M40 60 L60 80 C57 85 52 90 47 90 H20 L40 60 Z" fill="#000000" fillOpacity="0.1" />
          <path d="M80 10 C85 10 90 15 90 20 L60 80 L80 10 Z" fill="#000000" fillOpacity="0.05" />
          <defs>
            <linearGradient id="auth_sevn_gradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B7F569"/>
              <stop offset="1" stopColor="#1A5A44"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="text-[13px] font-bold text-on-surface md:text-white tracking-[0.2em] uppercase opacity-90 mt-2 pl-2">
          SEVN
        </div>
      </Link>

      {/* Left Side - Model Photo & Gradient Background */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-end relative overflow-hidden min-h-screen bg-[#05110c]">
        {/* Premium Dark Green Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(183,245,105,0.15)_0%,_rgba(5,17,12,1)_70%)] z-0"></div>
        
        {/* Soft Glow behind model */}
        <div className="absolute bottom-[10%] right-[10%] w-[80%] h-[60%] bg-[#B7F569]/10 blur-[120px] rounded-full z-0"></div>
        
        {/* Model Image - properly blended flush to bottom without cutout */}
        <div className="relative z-10 w-full flex justify-center items-end h-full">
          <img 
            src="/dhoni.png" 
            alt="Brand Ambassador" 
            className="w-full max-w-[600px] object-contain drop-shadow-2xl"
          />
        </div>
        
        {/* Thick gradient overlay to blend the bottom seamlessly into the background */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#05110c] via-[#05110c]/80 to-transparent z-20 pointer-events-none"></div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-surface-container-lowest min-h-screen relative z-10">
        <div className="w-full max-w-md mt-16 md:mt-0">
          <Outlet />
        </div>
      </div>
      
    </div>
  );
};

export default AuthLayout;
