// ProviderRegisterPage.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ChevronLeft, Upload, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface FormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  serviceCategory: string;
  businessPhoto: string | null;
  custom_category: string;
}

interface VerificationStatus {
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

const VerificationStatusDisplay = ({ 
  status, 
  notes,
  isDarkMode 
}: { 
  status: VerificationStatus['status'];  // Update this line
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
      description: 'Your registration is being reviewed by our admin team.'
    },
    approved: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      title: 'Verification Approved',
      description: 'Your account has been verified. You can now start offering services.'
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      title: 'Verification Rejected',
      description: 'Unfortunately, your verification was not approved.'
    }
  };

  // Add this check
  if (!status || !statusConfigs[status as keyof typeof statusConfigs]) {
    return null;
  }

  const config = statusConfigs[status as keyof typeof statusConfigs];
  const Icon = config.icon;

  return (
    <Alert className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : config.bgColor} mt-4`}>
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

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    serviceCategory: '',
    businessPhoto: null,
    custom_category: '',
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

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (providerId) {
        try {
          const response = await fetch(`http://beerescue.xyz:5000/api/provider/${providerId}/verification-status`);
          if (response.ok) {
            const data = await response.json();
            setVerificationStatus(data);
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
        }
      }
    };

    if (providerId) {
      const interval = setInterval(checkVerificationStatus, 30000); // Check every 30 seconds
      checkVerificationStatus(); // Initial check
      return () => clearInterval(interval);
    }
  }, [providerId]);

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
  
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://beerescue.xyz:5000/api/provider/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_photo: formData.businessPhoto,
          business_name: formData.businessName,
          owner_name: formData.ownerName,
          service_category: formData.serviceCategory,
          custom_category: formData.serviceCategory === 'Other' ? formData.custom_category : '',
          email: formData.email,
          phone_number: formData.phone,
          password: formData.password
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      setProviderId(data.provider_id);
      setRegistrationComplete(true);
      setVerificationStatus({ status: 'pending' });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registrationComplete) {
    return (
      <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-8`}>
        <div className="max-w-md mx-auto">
          <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Registration Submitted
          </h1>
          
          {verificationStatus && (
            <VerificationStatusDisplay 
              status={verificationStatus.status}
              notes={verificationStatus.notes}
              isDarkMode={isDarkMode}
            />
          )}

          <div className={`mt-6 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>We will notify you once your account has been verified. You can also check your verification status by logging in.</p>
          </div>

          <Link 
            href="/"
            className={`block text-center mt-6 text-blue-500 hover:text-blue-600`}
          >
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

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
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Note: Your account will need to be verified by an admin before you can start offering services.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* IC Photo Upload */}
          <div>
            <label 
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              IC Photo
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
                required
              />
              <label 
                htmlFor="photo-upload"
                className="cursor-pointer block"
              >
                {formData.businessPhoto ? (
                  <div className="relative">
                    <img 
                      src={formData.businessPhoto} 
                      alt="IC Photo preview" 
                      className="w-32 h-32 mx-auto object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <>
                    <Upload className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Upload IC Photo (Required for verification)
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
            <div className="space-y-3">
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

              {formData.serviceCategory === 'Other' && (
                <div className="mt-3">
                  <input
                    type="text"
                    id="customCategory"
                    placeholder="Enter your custom category"
                    className={`w-full px-4 py-3 rounded-lg ${
                      isDarkMode 
                      ? 'bg-gray-800 text-gray-100 border-gray-700' 
                      : 'bg-gray-50 text-gray-900 border-gray-200'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={formData.custom_category}
                  onChange={(e) => setFormData({ ...formData, custom_category: e.target.value })}
                  required
                />
              </div>
            )}
          </div>
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
            <Link href="/terms" className="text-blue-500 hover:text-blue-600">
              Terms & Conditions
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