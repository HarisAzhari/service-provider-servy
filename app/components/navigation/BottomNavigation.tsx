'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BriefcaseIcon, CalendarDays, DollarSign, UserCircle } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const BottomNavigation = () => {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/provider/dashboard'
    },
    {
      icon: BriefcaseIcon,
      label: 'Services',
      href: '/provider/services'
    },
    {
      icon: CalendarDays,
      label: 'Bookings',
      href: '/provider/bookings'
    },
    {
      icon: DollarSign,
      label: 'Earnings',
      href: '/provider/earnings'
    },
    {
      icon: UserCircle,
      label: 'Profile',
      href: '/provider/profile'
    }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-t shadow-lg`}>
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center min-w-[64px] py-1"
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${
                  isActive 
                    ? 'text-blue-500'
                    : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } ${
                  !isActive && 'transition-colors duration-200'
                } ${
                  !isActive && (isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-700')
                }`}
              />
              <span 
                className={`text-xs ${
                  isActive 
                    ? 'text-blue-500 font-medium'
                    : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } ${
                  !isActive && 'transition-colors duration-200'
                } ${
                  !isActive && (isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-700')
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;