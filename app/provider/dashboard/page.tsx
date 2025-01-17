/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  Star,
  Clock,
  ChevronRight,
  TrendingUp,
  Bell,
  CheckCircle2,
  XCircle,
  Clock3
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import Link from 'next/link';

interface EarningsStat {
  amount: number;
  percentage: number;
  trend: 'up' | 'down';
}

interface Booking {
  id: string;
  customerName: string;
  service: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  amount: number;
  customerImage: string;
}

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: { 
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  color: string;
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <h3 className={`text-xl font-semibold mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {value}
          </h3>
          {subtitle && (
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`${color} bg-opacity-10 p-2 rounded-lg`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );
};

const BookingItem = ({ booking }: { booking: Booking }) => {
  const { isDarkMode } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'confirmed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock3;
      case 'confirmed':
        return CheckCircle2;
      case 'cancelled':
        return XCircle;
      default:
        return Clock3;
    }
  };

  const StatusIcon = getStatusIcon(booking.status);

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl mb-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <img 
            src={booking.customerImage} 
            alt={booking.customerName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {booking.customerName}
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {booking.service}
            </p>
          </div>
        </div>
        <div className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm capitalize">{booking.status}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Clock className="w-4 h-4 inline mr-1" />
          {booking.time}
        </div>
        <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          ${booking.amount}
        </span>
      </div>
    </div>
  );
};

export default function ProviderDashboardPage() {
  const { isDarkMode } = useTheme();

  const earnings: EarningsStat = {
    amount: 1250,
    percentage: 12.5,
    trend: 'up'
  };

  const recentBookings: Booking[] = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      service: 'House Cleaning',
      time: 'Today, 2:00 PM',
      status: 'pending',
      amount: 120,
      customerImage: '/api/placeholder/40/40'
    },
    {
      id: '2',
      customerName: 'Mike Smith',
      service: 'Kitchen Cleaning',
      time: 'Today, 4:30 PM',
      status: 'confirmed',
      amount: 80,
      customerImage: '/api/placeholder/40/40'
    },
    {
      id: '3',
      customerName: 'Emily Brown',
      service: 'Bathroom Cleaning',
      time: 'Tomorrow, 10:00 AM',
      status: 'cancelled',
      amount: 60,
      customerImage: '/api/placeholder/40/40'
    }
  ];

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Dashboard
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Welcome back, John!
            </p>
          </div>
          <button className="relative">
            <Bell className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="bg-blue-500 rounded-xl p-4 text-white mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-blue-100">Total Earnings</p>
            <span className="text-xs bg-blue-400 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {earnings.percentage}%
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">${earnings.amount}</h2>
          <p className="text-sm text-blue-100">This month</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <StatsCard
          title="Bookings"
          value="24"
          subtitle="This week"
          icon={Calendar}
          color="text-purple-500"
        />
        <StatsCard
          title="Customers"
          value="156"
          subtitle="Total"
          icon={Users}
          color="text-green-500"
        />
        <StatsCard
          title="Rating"
          value="4.8"
          subtitle="Average"
          icon={Star}
          color="text-yellow-500"
        />
        <StatsCard
          title="Revenue"
          value="$890"
          subtitle="This week"
          icon={DollarSign}
          color="text-blue-500"
        />
      </div>

      {/* Recent Bookings */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Recent Bookings
          </h2>
          <Link 
            href="/provider/bookings" 
            className="text-blue-500 text-sm flex items-center"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}