/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react';
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
  MapPin
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import BottomNavigation from '../../components/navigation/BottomNavigation';

interface MenuItem {
  icon: any;
  label: string;
  href?: string;
  onClick?: () => void;
  info?: string;
  color?: string;
}

const MenuGroup = ({ 
  title, 
  items 
}: { 
  title: string; 
  items: MenuItem[];
}) => {
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
          const Component = item.href ? Link : 'button';

          return (
            <Component
              key={item.label}
              href={item.href || ''}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between p-4 ${
                isDarkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-50'
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
            </Component>
          );
        })}
      </div>
    </div>
  );
};

export default function ProviderProfilePage() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const accountItems: MenuItem[] = [
    {
      icon: User,
      label: 'Personal Information',
      href: '/provider/profile/personal',
      color: 'bg-blue-500'
    },
    {
      icon: MapPin,
      label: 'Business Location',
      href: '/provider/profile/location',
      color: 'bg-green-500'
    },
    {
      icon: CreditCard,
      label: 'Payment Methods',
      href: '/provider/profile/payment',
      color: 'bg-purple-500'
    }
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
    },
    {
      icon: Clock,
      label: 'Working Hours',
      href: '/provider/profile/hours'
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

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      {/* Profile Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <Image
                src="/api/placeholder/80/80"
                alt="Profile"
                width={80}
                height={80}
                className="object-cover"
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
              John's Cleaning Service
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Professional Cleaner
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                4.9 ★
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                156 Reviews
              </span>
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