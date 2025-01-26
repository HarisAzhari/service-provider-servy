'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';

interface ProviderData {
  id: number;
  business_photo: string;
  business_name: string;
  owner_name: string;
  service_category: string;
  custom_category: string | null;
  category_display: string;
  email: string;
  phone_number: string;
}

interface AlertProps {
  message: string;
  type: 'success' | 'error';
}

const Alert = ({ message, type }: AlertProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`${
      type === 'success' 
        ? 'bg-green-500/10 text-green-500' 
        : 'bg-red-500/10 text-red-500'
    } px-4 py-3 rounded-lg flex items-center gap-2 mb-4`}>
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default function EditProfilePage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [profileData, setProfileData] = useState<ProviderData | null>(null);
  const [newImage, setNewImage] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!isClient) return;

        const providerId = localStorage.getItem('provider_id');
        if (!providerId) {
          router.push('/provider/login');
          return;
        }

        const response = await fetch(`http://127.0.0.1:5000/api/provider/profile/${providerId}`);
        
        if (response.status === 401) {
          localStorage.removeItem('provider_id');
          localStorage.removeItem('provider_data');
          router.push('/provider/login');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch profile data');

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setAlert({
          type: 'error',
          message: 'Failed to load profile data'
        });
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchProfile();
    }
  }, [isClient, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      const providerId = localStorage.getItem('provider_id');
      if (!providerId) {
        router.push('/provider/login');
        return;
      }

      const formData = new FormData(e.currentTarget);
      const updateData: any = {
        business_name: formData.get('business_name'),
        owner_name: formData.get('owner_name'),
        phone_number: formData.get('phone_number')
      };

      if (newImage) {
        updateData.business_photo = newImage;
      }

      const response = await fetch(`http://127.0.0.1:5000/api/provider/update/${providerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setAlert({
        type: 'success',
        message: 'Profile updated successfully'
      });

      // Update local storage
      const storedData = JSON.parse(localStorage.getItem('provider_data') || '{}');
      localStorage.setItem('provider_data', JSON.stringify({
        ...storedData,
        ...updateData
      }));

    } catch (error) {
      console.error('Error updating profile:', error);
      setAlert({
        type: 'error',
        message: 'Failed to update profile'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isClient || loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
        <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Loading profile...</p>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sticky top-0 z-10 shadow-sm`}>
        <div className="flex items-center gap-3">
          <Link href="/provider/profile">
            <ChevronLeft className={`w-6 h-6 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`} />
          </Link>
          <h1 className={`text-xl font-semibold ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Edit Profile
          </h1>
        </div>
      </div>

      <div className="p-4">
        {alert && <Alert type={alert.type} message={alert.message} />}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={newImage || profileData?.business_photo || '/default-business.png'}
                alt="IC Photo"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
              />
              <label className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Business Name
              </label>
              <input
                type="text"
                name="business_name"
                defaultValue={profileData?.business_name}
                className={`w-full px-4 py-2.5 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-white text-gray-900'
                } border ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Owner Name
              </label>
              <input
                type="text"
                name="owner_name"
                defaultValue={profileData?.owner_name}
                className={`w-full px-4 py-2.5 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-white text-gray-900'
                } border ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                defaultValue={profileData?.phone_number}
                className={`w-full px-4 py-2.5 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-white text-gray-900'
                } border ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                defaultValue={profileData?.email}
                className={`w-full px-4 py-2.5 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-white text-gray-900'
                } border ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } bg-opacity-50`}
                disabled
              />
              <p className={`mt-1 text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Service Category
              </label>
              <input
                type="text"
                defaultValue={profileData?.category_display}
                className={`w-full px-4 py-2.5 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-white text-gray-900'
                } border ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } bg-opacity-50`}
                disabled
              />
              <p className={`mt-1 text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Category cannot be changed
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className={`w-full py-3 rounded-lg bg-blue-500 text-white font-medium
              ${saving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'}
              transition-colors flex items-center justify-center gap-2`}
          >
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <BottomNavigation />
    </main>
  );
}