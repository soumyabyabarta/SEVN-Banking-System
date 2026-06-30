import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getHistory, getAccounts } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { ArrowUpRight, ArrowDownLeft, Filter, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentAccountId, setCurrentAccountId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accRes = await getAccounts();
        const accountsList = Array.isArray(accRes) ? accRes : (accRes?.accounts || []);
        
        if (accountsList && accountsList.length > 0) {
          const accId = accountsList[0]._id;
          setCurrentAccountId(accId);
          
          const txRes = await getHistory();
          const txData = Array.isArray(txRes) ? txRes : (txRes?.data || []);
          
          if (txData) {
            setTransactions(txData);
          }
        }
      } catch (error) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    
    const toAccountId = typeof tx.toAccount === 'object' ? tx.toAccount?._id : tx.toAccount;
    const isIncome = String(toAccountId) === String(currentAccountId);
    
    if (filter === 'income') return isIncome;
    if (filter === 'expense') return !isIncome;
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2 tracking-tight">Ledger</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">Immutable transaction history.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-surface-container-low p-2 rounded-full border border-outline-variant/30">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full text-label-md font-label-md transition-all ${filter === 'all' ? 'bg-primary text-secondary-container shadow-ultra-soft' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            All
          </button>
          <button 
             onClick={() => setFilter('income')}
            className={`px-6 py-2 rounded-full text-label-md font-label-md transition-all ${filter === 'income' ? 'bg-primary text-secondary-container shadow-ultra-soft' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Income
          </button>
          <button 
             onClick={() => setFilter('expense')}
            className={`px-6 py-2 rounded-full text-label-md font-label-md transition-all ${filter === 'expense' ? 'bg-primary text-secondary-container shadow-ultra-soft' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Expense
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[32px] p-6 shadow-ultra-soft border border-outline-variant/30">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="space-y-4">

            {filteredTransactions.length === 0 && (
              <div className="text-center py-10">
                 <div className="w-16 h-16 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-4">
                   <Filter className="text-on-surface-variant" size={24} />
                 </div>
                 <p className="text-body-lg font-body-lg text-on-surface-variant">No {filter !== 'all' ? filter : ''} transactions found.</p>
              </div>
            )}

            {filteredTransactions.map((tx) => {
              const toAccountId = typeof tx.toAccount === 'object' ? tx.toAccount?._id : tx.toAccount;
              const fromAccountId = typeof tx.fromAccount === 'object' ? tx.fromAccount?._id : tx.fromAccount;
              const isIncome = String(toAccountId) === String(currentAccountId);
              
              // Smart check to style the Welcome Bonus cleanly
              const isWelcomeBonus = isIncome && tx.amount === 7000;

              return (
                <div key={tx._id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low transition-colors gap-2">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full flex items-center justify-center shadow-sm ${isIncome ? 'bg-[#c7ebd2]/50 text-secondary' : 'bg-[#ffdad6]/50 text-[#93000a]'}`}>
                      {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-label-md font-label-md text-on-surface mb-1 truncate">
                        {isWelcomeBonus ? 'Welcome Bonus' : (isIncome ? 'Received from' : 'Sent to')}
                      </p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant truncate">
                        {isWelcomeBonus ? 'from Team SEVN' : (isIncome ? (tx.fromAccount?.name || fromAccountId) : (tx.toAccount?.name || toAccountId))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <p className={`text-title-lg md:text-headline-md font-headline-md mb-1 tracking-tight ${isIncome ? 'text-secondary' : 'text-on-surface'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">
                      {formatDate(tx.timestamp || tx.date || tx.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default History;