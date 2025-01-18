'use client'

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  provider_id: number;
  business_name: string;
  email: string;
  business_photo: string;
  service_category: string;
}

export default function ProviderLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
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

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store provider data in localStorage
      localStorage.setItem('provider_id', data.provider_id.toString());
      localStorage.setItem('provider_data', JSON.stringify({
        business_name: data.business_name,
        email: data.email,
        business_photo: data.business_photo,
        service_category: data.service_category
      }));

      console.log('Login successful, redirecting...', data);
      router.push('/provider/profile');
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
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

        {searchParams.get('registered') && (
          <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Registration successful! Please log in with your credentials.
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