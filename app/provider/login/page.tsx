'use client'

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ChevronLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface LoginFormData {
  email: string;
  password: string;
}

interface Provider {
  id: number;
  business_name: string;
  email: string;
  business_photo: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verification_message: string | null;
}

interface LoginResponse {
  can_create_services: boolean;
  provider: Provider;
}

const VerificationMessage = ({ 
  status, 
  notes,
  isDarkMode 
}: { 
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  isDarkMode: boolean;
}) => {
  const statusConfigs = {
    pending: {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      title: 'Verification Pending',
      description: 'Your account is still being reviewed by our admin team. Please check back later.'
    },
    approved: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      title: 'Verification Approved',
      description: 'Your account has been verified. You can now proceed to login.'
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      title: 'Verification Rejected',
      description: 'Your account verification was not approved.'
    }
  };

  const config = statusConfigs[status];
  const Icon = config.icon;

  return (
    <Alert className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : config.bgColor} mb-6`}>
      <Icon className={`h-5 w-5 ${config.color}`} />
      <AlertTitle className={isDarkMode ? 'text-white' : config.textColor}>
        {config.title}
      </AlertTitle>
      <AlertDescription className={isDarkMode ? 'text-gray-300' : config.textColor}>
        {config.description}
        {notes && <div className="mt-2">Note: {notes}</div>}
      </AlertDescription>
    </Alert>
  );
};

export default function ProviderLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<LoginResponse['verification_status']>();
  const [verificationNotes, setVerificationNotes] = useState<string>();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setVerificationStatus(undefined);
    setVerificationNotes(undefined);

    console.log('Attempting login with:', { email: formData.email });

    try {
      console.log('Making API request...');
      const response = await fetch('http://127.0.0.1:5000/api/provider/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log('Response status:', response.status);
      const data: LoginResponse = await response.json();
      console.log('API Response:', data);
      
      if (!response.ok) {
        console.error('Response not OK:', response.status, data);
        throw new Error(data.message || 'Login failed');
      }

      // Check verification status
      console.log('Checking verification status:', data.provider.verification_status);
      
      if (data.provider.verification_status === 'pending') {
        console.log('Account pending verification');
        setVerificationStatus('pending');
        setVerificationNotes(data.provider.verification_message || undefined);
        return;
      } else if (data.provider.verification_status === 'rejected') {
        console.log('Account verification rejected');
        setVerificationStatus('rejected');
        setVerificationNotes(data.provider.verification_message || undefined);
        return;
      }

      // Only proceed with login if verified
      if (data.provider.verification_status === 'approved') {
        console.log('Account verified, proceeding with login');
        const { provider } = data;

        // Store provider data in localStorage
        localStorage.setItem('provider_id', provider.id.toString());
        localStorage.setItem('provider_data', JSON.stringify({
          business_name: provider.business_name,
          email: provider.email,
          business_photo: provider.business_photo || '',
          can_create_services: data.can_create_services
        }));

        router.push('/provider/profile');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      // More detailed error logging
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack
        });
      }
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
      console.log('Login attempt completed');
    }
  };

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center sticky top-0 z-10`}>
        <Link href="/" className="block">
          <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
        </Link>
        <h1 className={`text-lg font-semibold ml-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Service Provider Login
        </h1>
      </div>

      {/* Login Form */}
      <div className="p-4 mt-8">
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
            Welcome Back!
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Login to manage your services and bookings
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {verificationStatus && (
          <VerificationMessage 
            status={verificationStatus}
            notes={verificationNotes}
            isDarkMode={isDarkMode}
          />
        )}

        {searchParams.get('registered') && (
          <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Registration successful! Please wait for admin verification before logging in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-100 border-gray-700' 
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700' 
                    : 'bg-gray-50 text-gray-900 border-gray-200'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link 
              href="/provider/forgot-password"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-500'} text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Register Link */}
          <p className={`text-center mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <Link 
              href="/provider/register"
              className="text-blue-500 hover:text-blue-600"
            >
              Register Now
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}