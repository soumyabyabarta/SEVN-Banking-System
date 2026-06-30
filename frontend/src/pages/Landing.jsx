// frontend/src/pages/Landing.jsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const Landing = () => {
  return (
    <>
      {/* Injecting Premium Fintech Font (Plus Jakarta Sans) */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-fintech {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
        `}
      </style>

      <div className="min-h-screen bg-background font-fintech overflow-x-hidden selection:bg-secondary-container selection:text-primary">
        
        {/* Navbar - Only Logo & SEVN text */}
        <nav className="absolute w-full top-0 z-50 flex items-start px-6 md:px-12 pt-8 pointer-events-none">
          <div className="flex flex-col items-start gap-1 pointer-events-auto">
            
            {/* Stylish '7' Logo */}
            <svg 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 md:h-12 w-auto drop-shadow-lg"
            >
              <path d="M10 10 L80 10 C85 10 90 15 90 20 L60 80 C57 85 52 90 47 90 H20 L40 60 L10 10 Z" fill="url(#stylish_sevn_gradient)" />
              <path d="M10 10 L40 60 L10 10 Z" fill="#ffffff" fillOpacity="0.05" />
              <path d="M40 60 L60 80 C57 85 52 90 47 90 H20 L40 60 Z" fill="#000000" fillOpacity="0.1" />
              <path d="M80 10 C85 10 90 15 90 20 L60 80 L80 10 Z" fill="#000000" fillOpacity="0.05" />
              <defs>
                <linearGradient id="stylish_sevn_gradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#B7F569"/>
                  <stop offset="1" stopColor="#1A5A44"/>
                </linearGradient>
              </defs>
            </svg>

            {/* SEVN Text without the dot */}
            <div className="text-[13px] font-bold text-white tracking-[0.2em] uppercase opacity-90 mt-2 pl-2">
              SEVN
            </div>
          </div>
        </nav>

        {/* Hero Section - Reduced pt-40 to pt-28 for mobile */}
        <section className="relative pt-28 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-[radial-gradient(circle_at_50%_30%,_rgba(183,245,105,0.15)_0%,_rgba(13,59,46,1)_60%)] bg-[#0D3B2E] rounded-b-[4rem] md:rounded-b-[6rem]">
          <div className="max-w-container-max mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Text Content - Reduced pt-16 to pt-8 for mobile, fixed tracking and leading */}
              <div className="text-center lg:text-left text-on-primary flex flex-col items-center lg:items-start pt-8 md:pt-0">
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl sm:text-6xl md:text-[72px] lg:text-[84px] font-extrabold tracking-tight text-white leading-tight"
                >
                  Tomorrow's Banking is Here
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-lg md:text-xl font-medium text-white/80 max-w-xl leading-relaxed mt-6 md:mt-8"
                >
                  SEVN is the banking app for people who trust timing more than hype.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-10 md:mt-12"
                >
                  <Link to="/register" className="bg-secondary-container text-primary px-10 py-4 rounded-full font-bold text-[15px] uppercase tracking-wider hover:bg-white transition-all shadow-[0_8px_32px_rgba(183,245,105,0.3)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.4)] text-center relative z-20 pointer-events-auto inline-block">
                    Open Account
                  </Link>
                </motion.div>
              </div>

              {/* Mockup & Stats */}
              <div className="relative mt-16 lg:mt-0 h-[500px] md:h-[600px] flex justify-center items-center">
                
                {/* Floating Stat 1 */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="absolute top-1/4 right-0 lg:-right-4 bg-[#0A2A1A]/80 md:bg-white/10 backdrop-blur-[24px] border border-secondary-container/30 md:border-white/20 px-5 py-3 rounded-full shadow-ultra-soft z-20 transform rotate-3 flex items-center gap-3"
                >
                  <div className="bg-secondary-container/20 p-2 rounded-full">
                    <Zap className="text-secondary-container" size={20} />
                  </div>
                  <span className="text-secondary-container md:text-white text-sm font-semibold md:font-medium">+32% Efficiency</span>
                </motion.div>

                {/* Floating Stat 2 */}
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.8, delay: 0.5 }}
                   className="absolute bottom-1/3 left-0 lg:-left-8 bg-[#0A2A1A]/80 md:bg-white/10 backdrop-blur-[24px] border border-secondary-container/30 md:border-white/20 px-5 py-3 rounded-full shadow-ultra-soft z-20 transform -rotate-2 flex items-center gap-3"
                >
                  <div className="bg-white/20 p-2 rounded-full hidden md:block">
                    <ShieldCheck className="text-white" size={20} />
                  </div>
                  <div className="bg-secondary-container/20 p-2 rounded-full md:hidden">
                    <ShieldCheck className="text-secondary-container" size={20} />
                  </div>
                  <span className="text-secondary-container md:text-white text-sm font-semibold md:font-medium">Immutable Ledger</span>
                </motion.div>

                {/* Floating Stat 3 */}
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.8, delay: 0.6 }}
                   className="absolute bottom-10 right-4 lg:right-4 bg-[#0A2A1A]/80 md:bg-white/10 backdrop-blur-[24px] border border-secondary-container/30 md:border-white/20 px-5 py-3 rounded-full shadow-ultra-soft z-20 transform rotate-1 flex items-center gap-3"
                >
                  <div className="bg-secondary-container/20 p-2 rounded-full">
                    <BarChart3 className="text-secondary-container" size={20} />
                  </div>
                  <span className="text-secondary-container md:text-white text-sm font-semibold md:font-medium">99.9% Uptime</span>
                </motion.div>

                {/* Abstract App Mockup */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="relative z-10 transform -rotate-12 scale-100 md:scale-110 shadow-[0_40px_80px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden border-8 border-[#0D3B2E]/50 w-[280px] md:w-[320px] h-[560px] md:h-[640px] bg-surface flex flex-col"
                >
                  <div className="p-6 bg-gradient-to-br from-[#0A2A1A] to-[#1A3A2A] text-white flex-1 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none"></div>
                    <p className="text-primary-fixed-dim text-xs font-semibold mb-1 uppercase tracking-widest">Total Balance</p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">₹7,000.00</h2>
                    
                    <div className="mt-8 flex gap-4">
                       <div>
                         <p className="text-white/60 text-xs mb-1 font-medium">Income</p>
                         <p className="text-secondary-container text-sm font-bold">+₹10,000.00</p>
                       </div>
                       <div>
                         <p className="text-white/60 text-xs mb-1 font-medium">Expenses</p>
                         <p className="text-[#FFB4AB] text-sm font-bold">-₹3,000.00</p>
                       </div>
                    </div>
                  </div>
                  <div className="bg-surface h-1/2 p-4">
                    <div className="bg-white rounded-2xl p-4 shadow-ultra-soft h-full">
                      <p className="text-sm font-bold mb-4 text-on-surface">Recent Activity</p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 rounded-full bg-surface-container"></div>
                            <div className="h-2 w-20 bg-surface-variant rounded-full"></div>
                          </div>
                          <div className="h-2 w-10 bg-surface-variant rounded-full"></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 rounded-full bg-surface-container"></div>
                            <div className="h-2 w-16 bg-surface-variant rounded-full"></div>
                          </div>
                          <div className="h-2 w-10 bg-surface-variant rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-10 text-center text-on-surface-variant text-sm font-medium bg-background">
          <p>© 2026 Soumya || All rights reserved</p>
        </footer>
      </div>
    </>
  );
};

export default Landing;