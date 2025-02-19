'use client'

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Clock, 
  Shield, 
  CreditCard,
  ChevronRight,
  LogOut,
  Moon,
  HelpCircle,
  MapPin,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';

interface MenuItem {
  icon: any;
  label: string;
  href?: string;
  onClick?: () => void;
  info?: string;
  color?: string;
}

interface ProviderProfile {
  id: number;
  business_name: string;
  owner_name: string;
  business_photo: string;
  service_category: string;
  email: string;
  phone_number: string;
}

interface ProviderRating {
  total_rating: number | null;
  rating_count: number;
}



const MenuGroup = ({ title, items }: { title: string; items: MenuItem[]; }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className="mb-6">
      <h2 className={`text-sm font-medium mb-2 px-4 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {title}
      </h2>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden`}>
        {items.map((item, index) => {
          const Icon = item.icon;
          
          // If it's a button (has onClick), render a button
          if (!item.href) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between p-4 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } transition-colors ${
                  index !== items.length - 1 
                    ? isDarkMode 
                      ? 'border-b border-gray-700' 
                      : 'border-b border-gray-100'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.color || (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      item.color ? 'text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  </div>
                  <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.info && (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.info}
                    </span>
                  )}
                  <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              </button>
            );
          }

          // If it has href, render a Link
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center justify-between p-4 ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              } transition-colors ${
                index !== items.length - 1 
                  ? isDarkMode 
                    ? 'border-b border-gray-700' 
                    : 'border-b border-gray-100'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.color || (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                }`}>
                  <Icon className={`w-4 h-4 ${
                    item.color ? 'text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.info && (
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.info}
                  </span>
                )}
                <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default function ProviderProfilePage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [ratingData, setRatingData] = useState<ProviderRating>({
    total_rating: null,
    rating_count: 0
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!isClient) return;

        const providerId = localStorage.getItem('provider_id');
        const storedData = localStorage.getItem('provider_data');
        
        console.log('Provider ID:', providerId);
        console.log('Stored Data:', storedData);

        if (!providerId || !storedData) {
          console.log('No stored data found, redirecting to login...');
          router.push('/provider/login');
          return;
        }

        const response = await fetch(`http://beerescue.xyz:5000/api/provider/profile/${providerId}`);
        
        if (response.status === 401) {
          console.log('Unauthorized, redirecting to login...');
          localStorage.removeItem('provider_id');
          localStorage.removeItem('provider_data');
          router.push('/provider/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        console.log('Profile data:', data);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchProfile();
    }
  }, [isClient, router]);

  // Add this effect to fetch the ratings
useEffect(() => {
  const fetchRatings = async () => {
    try {
      if (!isClient) return;
      
      const providerId = localStorage.getItem('provider_id');
      if (!providerId) return;
      
      // Use your existing API endpoint to get provider ratings
      const response = await fetch(`http://beerescue.xyz:5000/api/provider/${providerId}/rating`);
      if (!response.ok) throw new Error('Failed to fetch ratings');
      
      const data = await response.json();
      setRatingData({
        total_rating: data.average_rating || 0,
        rating_count: data.rating_count || 0
      });
      
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  fetchRatings();
}, [isClient]);

  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem('provider_id');
      localStorage.removeItem('provider_data');
      router.push('/provider/login');
    }
  };

  if (!isClient) {
    return null;
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Error loading profile</div>;
  }

  const accountItems: MenuItem[] = [
    {
      icon: User,
      label: 'Personal Information',
      href: '/provider/profile/edit',
      color: 'bg-blue-500'
    },
    
  ];

  const preferencesItems: MenuItem[] = [
    {
      icon: Bell,
      label: 'Notifications',
      href: '/provider/profile/notifications'
    },
    {
      icon: Moon,
      label: 'Dark Mode',
      onClick: toggleDarkMode,
      info: isDarkMode ? 'On' : 'Off'
    }
  ];

  const supportItems: MenuItem[] = [
    {
      icon: HelpCircle,
      label: 'Help Center',
      href: '/provider/help'
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      href: '/provider/privacy'
    }
  ];

  const renderStars = (rating: number | null, count: number) => {
    if (!rating && count === 0) {
      return (
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No reviews yet
        </span>
      );
    }
  
    const roundedRating = Math.round((rating || 0) * 2) / 2;
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={14}  // Smaller size for profile header
              className={`${
                index < Math.floor(roundedRating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : index === Math.floor(roundedRating) && roundedRating % 1 !== 0
                  ? 'text-yellow-400 fill-yellow-400 opacity-50'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {rating ? ` ${rating.toFixed(1)} (${count})` : ''}
        </span>
      </div>
    );
  };

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      {/* Profile Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              src={profile.business_photo || '/placeholder-image.jpg'}
              alt="Profile"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
            </div>
            <button className={`absolute bottom-0 right-0 p-1.5 rounded-full ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Settings className={`w-4 h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </button>
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {profile.business_name}
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {profile.service_category}
            </p>
            <div className="flex items-center gap-2 mt-1">
  {renderStars(ratingData.total_rating, ratingData.rating_count)}
</div>
          </div>
        </div>
      </div>

      {/* Menu Groups */}
      <div className="p-4 space-y-6">
        <MenuGroup title="ACCOUNT" items={accountItems} />
        <MenuGroup title="PREFERENCES" items={preferencesItems} />
        <MenuGroup title="SUPPORT" items={supportItems} />

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700' 
              : 'bg-white hover:bg-gray-50'
          } text-red-500 transition-colors`}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>

      <BottomNavigation />
    </main>
  );
}