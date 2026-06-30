import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Lock } from 'lucide-react';
import api, { getAccounts, getHistory } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';

const transferSchema = z.object({
  toAccount: z.string().min(1, 'Recipient Account ID is required'),
  amount: z.number({ invalid_type_error: 'Amount must be a number' }).positive('Amount must be greater than zero'),
});

const Transfer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(transferSchema),
  });

  useEffect(() => {
    setIdempotencyKey(uuidv4());

    const fetchAccountsAndBalance = async () => {
      try {
        const accRes = await getAccounts();
        const accountsList = Array.isArray(accRes) ? accRes : (accRes?.accounts || accRes?.data || []);
        
        if (accountsList && accountsList.length > 0) {
          const accId = accountsList[0]._id;
          setCurrentAccountId(accId);
          
          // Dashboard-এর মতো লাইভ ব্যালেন্স ক্যালকুলেশন
          try {
            const txRes = await getHistory();
            const transactions = Array.isArray(txRes) ? txRes : (txRes?.data || []);
            
            let totalIncome = 0;
            let totalExpense = 0;
            
            transactions.forEach(tx => {
              const toId = typeof tx.toAccount === 'object' ? tx.toAccount?._id : tx.toAccount;
              const fromId = typeof tx.fromAccount === 'object' ? tx.fromAccount?._id : tx.fromAccount;
              
              if (String(toId) === String(accId)) totalIncome += tx.amount;
              if (String(fromId) === String(accId)) totalExpense += tx.amount;
            });
            
            setBalance(totalIncome - totalExpense);
          } catch (err) {
            console.error("Failed to calculate balance from history");
            setBalance(0);
          }
        }
      } catch (error) {
        toast.error('Failed to load your account info');
      }
    };
    
    fetchAccountsAndBalance();
  }, []);

  const onSubmit = async (data) => {
    if (!currentAccountId) {
      toast.error('Account is not ready yet. Please refresh.');
      return;
    }

    // Edge Case 1: নিজের অ্যাকাউন্টে নিজে টাকা পাঠানো বন্ধ করা
    if (String(data.toAccount).trim() === String(currentAccountId)) {
      toast.error("You cannot transfer money to your own account! 😅");
      return;
    }

    // Edge Case 2: জিরো বা নেগেটিভ অ্যামাউন্ট চেক
    if (data.amount <= 0) {
      toast.error("Amount must be greater than zero!");
      return;
    }

    // Edge Case 3: ব্যালেন্সের চেয়ে বেশি টাকা পাঠানো বন্ধ করা
    if (balance !== null && data.amount > balance) {
      toast.error("Insufficient balance! Your bank account is crying rn 😭💸");
      return;
    }

    const payload = {
      fromAccount: currentAccountId,
      toAccount: data.toAccount.trim(),
      amount: data.amount,
      idempotencyKey: idempotencyKey,
    };

    try {
      setIsLoading(true);
      
      // সরাসরি API কল করছি যাতে ব্যাকএন্ডের চাহিদামতো পারফেক্ট ডেটা যায়
      const res = await api.post('/transactions/transfer', payload);
      
      if (res.status === 201 || res.status === 200) {
         toast.success(res.data.message || 'Transfer Successful! 🚀');
         reset();
         setIdempotencyKey(uuidv4()); // নতুন ট্রানজ্যাকশনের জন্য নতুন কী
         setTimeout(() => navigate('/history'), 1500);
      }
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Transaction failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-gutter px-4 md:px-0"
    >
      <div className="bg-surface-container-lowest rounded-[32px] p-6 md:p-12 shadow-ultra-soft border border-outline-variant/30">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2 tracking-tight">Send Money</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Transfer funds securely to any account.</p>
          </div>
          <div className="flex items-center gap-1 text-secondary text-label-sm font-label-sm font-semibold uppercase tracking-wider">
            <Lock size={14} /> Secure Transfer
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="flex flex-col items-center mb-8">
            <label className="text-label-md font-label-md text-on-surface-variant mb-4">Amount</label>
            <div className="flex items-center text-on-surface">
              <span className="text-headline-md font-headline-md mr-2 text-on-surface-variant">₹</span>
              <input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                placeholder="0.00"
                className="w-48 bg-transparent text-center outline-none font-headline-xl text-[56px] font-bold tracking-tighter placeholder:text-surface-dim"
              />
            </div>
            <p className={`text-label-sm font-label-sm mt-2 ${balance !== null && balance < 0 ? 'text-error' : 'text-on-surface-variant'}`}>
              Available: {balance !== null ? formatCurrency(balance) : 'Loading...'}
            </p>
            {errors.amount && <p className="text-error text-label-sm font-label-sm mt-2">{errors.amount.message}</p>}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-label-md font-label-md text-on-surface mb-2 ml-4">From Account</label>
              <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-full px-6 py-4 text-on-surface font-body-md shadow-sm">
                Checking **** {currentAccountId ? currentAccountId.slice(-4) : '----'}
              </div>
            </div>

            <div>
              <label className="block text-label-md font-label-md text-on-surface mb-2 ml-4">To Account</label>
              <input
                type="text"
                {...register('toAccount')}
                placeholder="Recipient Account ID"
                className={`w-full bg-surface-container-lowest border ${errors.toAccount ? 'border-error' : 'border-outline-variant'} rounded-full px-6 py-4 outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all text-on-surface font-body-md placeholder:text-on-surface-variant/50 shadow-sm`}
              />
              {errors.toAccount && <p className="text-error text-label-sm font-label-sm mt-1 ml-4">{errors.toAccount.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !currentAccountId || balance === null}
            className="w-full bg-secondary-container text-primary rounded-full py-4 text-label-md font-label-md font-bold uppercase tracking-wider hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-2 shadow-ultra-soft disabled:opacity-70 disabled:hover:bg-secondary-container"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
              <>Confirm Transfer <ArrowRight size={20} /></>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Transfer;