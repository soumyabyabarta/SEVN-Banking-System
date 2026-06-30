import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Send, History, Home, Info, CircleUser } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { logoutUser } from '../services/api';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      logout();
      navigate('/login');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Transfer', path: '/transfer', icon: <Send size={20} /> },
    { name: 'Passbook', path: '/history', icon: <History size={20} /> },
  ];

  const Logo = ({ className, idSuffix = "default" }) => (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-10 h-10 md:w-12 md:h-12 drop-shadow-md"
      >
        <path d="M10 10 L80 10 C85 10 90 15 90 20 L60 80 C57 85 52 90 47 90 H20 L40 60 L10 10 Z" fill={`url(#dash_sevn_gradient_${idSuffix})`} />
        <path d="M10 10 L40 60 L10 10 Z" fill="#ffffff" fillOpacity="0.05" />
        <path d="M40 60 L60 80 C57 85 52 90 47 90 H20 L40 60 Z" fill="#000000" fillOpacity="0.1" />
        <path d="M80 10 C85 10 90 15 90 20 L60 80 L80 10 Z" fill="#000000" fillOpacity="0.05" />
        <defs>
          <linearGradient id={`dash_sevn_gradient_${idSuffix}`} x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B7F569"/>
            <stop offset="1" stopColor="#1A5A44"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="text-[10px] md:text-[11px] font-bold text-on-surface tracking-[0.2em] uppercase opacity-90 mt-1 pl-1">
        SEVN
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-body-md text-on-surface">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant flex-col shrink-0 sticky top-0 h-screen py-8 px-4 justify-between">
        <div className="flex flex-col gap-8">
          <Link to="/dashboard" className="ml-4">
            <Logo idSuffix="desktop" />
          </Link>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                    isActive 
                      ? 'bg-primary text-secondary-container shadow-sm' 
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {link.icon}
                  <span className="text-label-md">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-col gap-2">
          <a href="https://github.com/soumyabyabarta/SEVN_backend_edger" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface font-semibold">
            <Info size={20} />
            <span className="text-label-md">About us</span>
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-error/10 text-error transition-colors bg-surface border border-outline-variant/30 font-semibold shadow-sm">
            <LogOut size={20} />
            <span className="text-label-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Top Navbar (Mobile Only) */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile h-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0px_20px_40px_rgba(13,59,46,0.08)]">
        <Link to="/dashboard">
          <div className="text-[20px] font-bold text-on-surface tracking-[0.2em] uppercase pl-2">
            SEVN
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <a href="https://github.com/soumyabyabarta/SEVN_backend_edger" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
            <Info size={20} />
          </a>
          <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 pt-24 md:pt-12 px-margin-mobile md:px-margin-desktop pb-32 md:pb-12 max-w-container-max mx-auto overflow-y-auto min-h-screen">
        {/* Desktop Header */}
        <header className="hidden md:flex justify-between items-end mb-8">
          <div>
            <h1 className="text-headline-xl font-headline-xl text-on-surface tracking-tight">Hello ! {user?.name || 'Alex'} 🖤</h1>
          </div>
        </header>

        {/* Content Area */}
        <Outlet />
      </main>

      {/* Bottom Navbar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 pb-safe shadow-[0px_-10px_40px_rgba(13,59,46,0.1)]">
        <div className="flex justify-around items-center h-20 px-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <div className={`p-2 rounded-full transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                  {link.icon}
                </div>
                <span className="text-[10px] font-bold tracking-wide">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default DashboardLayout;
