// ProviderRegisterPage.tsx
'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ChevronLeft, Upload } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

interface FormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  serviceCategory: string;
  businessPhoto: string | null;  // Changed from File to string
}

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    serviceCategory: '',
    businessPhoto: null,
  });

  const serviceCategories = [
    'Carpenter',
    'Cleaner',
    'Painter',
    'Electrician',
    'AC Repair',
    'Plumber',
    "Men's Salon",
    "Other"
  ];
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, businessPhoto: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await fetch('http://127.0.0.1:5000/api/provider/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_photo: formData.businessPhoto,
          business_name: formData.businessName,
          owner_name: formData.ownerName,
          service_category: formData.serviceCategory,
          email: formData.email,
          phone_number: formData.phone,
          password: formData.password
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
  
      router.push('/provider/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} pb-8`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center sticky top-0 z-10`}>
        <Link href="/" className="block">
          <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
        </Link>
        <h1 className={`text-lg font-semibold ml-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Create Provider Account
        </h1>
      </div>

      {/* Registration Form */}
      <div className="p-4">
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
            Join Our Platform
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Create an account to start offering your services
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Photo Upload */}
          <div>
            <label 
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Business Photo
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
  isDarkMode ? 'border-gray-700' : 'border-gray-300'
}`}>
  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
    id="photo-upload"
  />
  <label 
    htmlFor="photo-upload"
    className="cursor-pointer block"
  >
    {formData.businessPhoto ? (
      <div className="relative">
        <img 
          src={formData.businessPhoto} 
          alt="Business photo preview" 
          className="w-32 h-32 mx-auto object-cover rounded-lg"
        />
      </div>
    ) : (
      <>
        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Upload business photo
        </span>
      </>
    )}
  </label>
</div>
          </div>

          {/* Business Name */}
          <div>
            <label 
              htmlFor="businessName" 
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              placeholder="Enter your business name"
              className={`w-full px-4 py-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-100 border-gray-700' 
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
          </div>

          {/* Owner Name */}
          <div>
            <label 
              htmlFor="ownerName" 
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Owner Name
            </label>
            <input
              type="text"
              id="ownerName"
              placeholder="Enter owner's name"
              className={`w-full px-4 py-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-100 border-gray-700' 
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              required
            />
          </div>

          {/* Service Category */}
          <div>
            <label 
              htmlFor="serviceCategory" 
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Service Category
            </label>
            <select
              id="serviceCategory"
              className={`w-full px-4 py-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-100 border-gray-700' 
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.serviceCategory}
              onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {serviceCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Email */}
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

          {/* Phone Number */}
          <div>
            <label 
              htmlFor="phone" 
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              className={`w-full px-4 py-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-100 border-gray-700' 
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          {/* Password */}
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
                placeholder="Create a password"
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
            <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Password must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label 
              htmlFor="confirmPassword" 
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700' 
                    : 'bg-gray-50 text-gray-900 border-gray-200'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1"
              required
            />
            <label 
              htmlFor="terms" 
              className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              I agree to the{' '}
              <Link href="/terms" className="text-blue-500 hover:text-blue-600">Terms & Conditions
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-500 hover:text-blue-600">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-500'} text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors mt-6`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <p className={`text-center mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link 
              href="/provider/login"
              className="text-blue-500 hover:text-blue-600"
            >
              Login Here
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}