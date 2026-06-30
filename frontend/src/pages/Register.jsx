// frontend/src/pages/Register.jsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { registerUser } from '../services/api';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data);
      login(res.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 md:px-0">
      
      {/* Form Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4">
          Join SEVN
        </h1>
        {/* The requested witty text */}
        <p className="text-lg font-medium text-gray-600 leading-relaxed">
          SEVN keeps your money safer than your situationship keeps promises.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-4 uppercase tracking-wider">Full Name</label>
          <input
            type="text"
            {...register('name')}
            className={`w-full bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-full px-6 py-4 outline-none focus:border-[#0D3B2E] focus:ring-1 focus:ring-[#0D3B2E] transition-all text-gray-900 font-medium placeholder:text-gray-400 shadow-sm`}
            placeholder="GOAT MESSI"
          />
          {errors.name && <p className="text-red-500 text-xs font-bold mt-2 ml-4">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-4 uppercase tracking-wider">Email</label>
          <input
            type="email"
            {...register('email')}
            className={`w-full bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-full px-6 py-4 outline-none focus:border-[#0D3B2E] focus:ring-1 focus:ring-[#0D3B2E] transition-all text-gray-900 font-medium placeholder:text-gray-400 shadow-sm`}
            placeholder="name@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs font-bold mt-2 ml-4">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-4 uppercase tracking-wider">Password</label>
          <input
            type="password"
            {...register('password')}
            className={`w-full bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-full px-6 py-4 outline-none focus:border-[#0D3B2E] focus:ring-1 focus:ring-[#0D3B2E] transition-all text-gray-900 font-medium placeholder:text-gray-400 shadow-sm`}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-xs font-bold mt-2 ml-4">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0D3B2E] text-[#B7F569] rounded-full py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#1A5A44] transition-all shadow-lg disabled:opacity-70 mt-6"
        >
          {isSubmitting ? 'Creating Account...' : 'Open Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-black font-bold hover:text-gray-700 transition-colors underline decoration-2 underline-offset-4">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;