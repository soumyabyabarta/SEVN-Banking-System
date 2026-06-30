import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { getHistory } from '../services/api'; // আপনার API ফাংশন ইমপোর্ট করুন
import toast from 'react-hot-toast';

const PassbookPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // পেজ লোড হলে ব্যাকএন্ড থেকে ডেটা ফেচ করবে
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getHistory();
        setTransactions(data);
      } catch (error) {
        toast.error("Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === 'all') return true;
    return tx.type === activeTab;
  });

  return (
    <div className="p-8 w-full max-w-4xl mx-auto font-fintech">
      {/* Header (Hello test01 etc. should be above this) */}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Ledger</h2>
          <p className="text-gray-500 mt-1">Immutable transaction history.</p>
        </div>

        {/* Filters */}
        <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
          {['all', 'income', 'expense'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                activeTab === tab ? 'text-[#B7F569]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#0A2A1A] rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-40 text-gray-400 font-bold">
            Loading ledger...
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <motion.div
                    key={tx._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      {/* Dynamic Icon */}
                      <div className={`p-3 rounded-full ${
                        tx.type === 'income' 
                          ? 'bg-green-100/50 text-green-700' 
                          : 'bg-red-100/50 text-red-700'
                      }`}>
                        {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      
                      {/* Description & Date */}
                      <div>
                        <p className="text-base font-bold text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                          {new Date(tx.date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute:'2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Amount */}
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        tx.type === 'income' ? 'text-green-700' : 'text-gray-900'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                        {tx.type === 'income' ? 'Received' : 'Sent'}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-gray-400"
                >
                  <p className="text-sm font-bold">No {activeTab !== 'all' ? activeTab : ''} transactions found.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassbookPage;