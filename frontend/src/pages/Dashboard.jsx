import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAccounts, getHistory } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { formatCurrency } from '../utils/formatCurrency';
import { ArrowUpRight, Book, QrCode, Phone, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [accountId, setAccountId] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accRes = await getAccounts();
        const accountsList = Array.isArray(accRes) ? accRes : (accRes?.accounts || []);
        
        if (accountsList && accountsList.length > 0) {
          const account = accountsList[0];
          const accId = account._id;
          setAccountId(accId);
          
          try {
            const txRes = await getHistory();
            const transactions = Array.isArray(txRes) ? txRes : (txRes?.data || []);

            if (transactions) {
              let totalIncome = 0;
              let totalExpense = 0;
              
              transactions.forEach(tx => {
                const toId = typeof tx.toAccount === 'object' ? tx.toAccount?._id : tx.toAccount;
                const fromId = typeof tx.fromAccount === 'object' ? tx.fromAccount?._id : tx.fromAccount;
                
                // Convert to string for safe comparison
                if (String(toId) === String(accId)) {
                  totalIncome += tx.amount;
                }
                if (String(fromId) === String(accId)) {
                  totalExpense += tx.amount;
                }
              });
              
              setIncome(totalIncome);
              setExpense(totalExpense);
              // Live Balance Calculation: Income - Expense
              setBalance(totalIncome - totalExpense);
            }
          } catch (err) {
            console.error('Failed to fetch transactions for stats', err);
          }
        } else {
          toast.error('No bank account found. Please create one.');
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyAccountId = () => {
    if (accountId) {
      navigator.clipboard.writeText(accountId);
      toast.success('Account ID copied to clipboard!');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-gutter"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 space-y-gutter">
          
          <div className="bg-gradient-to-br from-[#0A2A1A] to-[#1A3A2A] rounded-[24px] p-8 md:p-10 text-white relative overflow-hidden shadow-ultra-soft">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-primary-fixed-dim font-label-md mb-2 uppercase tracking-widest">Total Balance</p>
                  {loading ? (
                    <div className="h-14 w-48 bg-white/10 animate-pulse rounded-lg mt-2"></div>
                  ) : (
                    <h2 className="text-headline-xl md:text-[56px] font-headline-xl font-bold tracking-tighter leading-none">
                      {formatCurrency(balance)}
                    </h2>
                  )}
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary-container rounded-full animate-pulse"></span>
                  <span className="text-label-sm font-label-sm text-primary-fixed">INR</span>
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="flex gap-6">
                  <div>
                    <p className="text-white/60 text-label-sm font-label-sm mb-1">Income</p>
                    <div className="flex items-center gap-1 text-secondary-container">
                      <ArrowUp size={16} />
                      <span className="text-label-md font-label-md">+{formatCurrency(income)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/60 text-label-sm font-label-sm mb-1">Expenses</p>
                    <div className="flex items-center gap-1 text-[#FFB4AB]">
                      <ArrowDown size={16} />
                      <span className="text-label-md font-label-md">-{formatCurrency(expense)}</span>
                    </div>
                  </div>
                </div>

                <img src="/logo.png" alt="Logo" className="h-6 opacity-50 grayscale" onError={(e) => e.target.style.display='none'} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/transfer" className="bg-white rounded-[24px] p-4 flex flex-col items-center justify-center gap-3 shadow-ultra-soft hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all group">
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                <ArrowUpRight size={28} />
              </div>
              <span className="text-label-md font-label-md text-on-surface">Transfer</span>
            </Link>
            <Link to="/history" className="bg-white rounded-[24px] p-4 flex flex-col items-center justify-center gap-3 shadow-ultra-soft hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all group">
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                <Book size={28} />
              </div>
              <span className="text-label-md font-label-md text-on-surface">Passbook</span>
            </Link>
            <button className="bg-white rounded-[24px] p-4 flex flex-col items-center justify-center gap-3 shadow-ultra-soft transition-all opacity-70 cursor-not-allowed">
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary transition-colors">
                <QrCode size={28} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-label-md font-label-md text-on-surface">UPI</span>
                <span className="text-[10px] text-error font-bold">Coming Soon</span>
              </div>
            </button>
            <a href="https://www.linkedin.com/in/soumya-byabarta-359364381/" target="_blank" rel="noreferrer" className="bg-white rounded-[24px] p-4 flex flex-col items-center justify-center gap-3 shadow-ultra-soft hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all group">
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                <Phone size={28} />
              </div>
              <span className="text-label-md font-label-md text-on-surface text-center">Contact Us</span>
            </a>
          </div>
          
        </div>

        <div className="lg:col-span-4 space-y-gutter">
          <div className="bg-white rounded-[24px] p-6 shadow-ultra-soft">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-md font-headline-md text-on-surface">My Cards</h3>
            </div>
            
            <div className="w-full h-[160px] rounded-[24px] bg-tertiary-container text-white p-5 flex flex-col justify-between relative overflow-hidden shadow-md">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <div className="flex justify-between items-start relative z-10">
                <span className="text-xs font-bold tracking-widest text-white/50 uppercase">SEVN BANK</span>
                <span className="material-symbols-outlined text-sm">wifi</span>
              </div>
              <div className="relative z-10">
                <p className="text-label-md font-label-md tracking-[0.2em] mb-1 text-white">**** **** **** 7777</p>
                <div className="flex justify-between items-end">
                  <p className="text-label-sm font-label-sm opacity-80">{user?.name || 'User'}</p>
                  <div className="flex space-x-[-8px]">
                    <div className="w-6 h-6 rounded-full bg-red-500/80 mix-blend-multiply"></div>
                    <div className="w-6 h-6 rounded-full bg-yellow-500/80 mix-blend-multiply"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4">
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-1">
                  Your Account ID
                </p>
                <p className="text-body-md font-mono text-on-surface font-semibold">
                  {accountId || 'Loading...'}
                </p>
              </div>
              <button 
                onClick={copyAccountId}
                className="p-3 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-xl transition-colors shadow-sm"
                title="Copy Account ID"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;