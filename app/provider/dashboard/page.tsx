'use client'

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Star,
  Clock,
  ChevronRight,
  Bell,
  CheckCircle2,
  XCircle,
  Clock3
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Booking {
  id: number;
  user_id: number;
  service_id: number;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' | 'paid_deposit';
  total_amount: number;
  booking_notes: string;
  created_at: string;
  service_title: string;
  service_image: string;
  user_name: string;
  user_mobile: string;
}

interface ProviderData {
  id: number;
  business_name: string;
  total_rating?: number;
  rating_count?: number;
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
      case 'approved':
      case 'paid_deposit':
        return 'text-green-500';
      case 'completed':
        return 'text-blue-500';
      case 'cancelled':
      case 'rejected':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock3;
      case 'approved':
      case 'paid_deposit':
      case 'completed':
        return CheckCircle2;
      case 'cancelled':
      case 'rejected':
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
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {booking.user_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {booking.user_name}
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {booking.service_title}
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
          {booking.booking_time}
        </div>
        <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          RM{booking.total_amount}
        </span>
      </div>
    </div>
  );
};

export default function ProviderDashboardPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Add isClient check
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!isClient) return;

        const providerId = localStorage.getItem('provider_id');
        const storedData = localStorage.getItem('provider_data');

        if (!providerId || !storedData) {
          console.log('No stored data found, redirecting to login...');
          router.push('/provider/login');
          return;
        }

        // Fetch provider data for name and rating
        const profileResponse = await fetch(`http://beerescue.xyz:5000/api/provider/profile/${providerId}`);
        if (!profileResponse.ok) throw new Error('Failed to fetch provider data');
        const profileData = await profileResponse.json();
        setProviderData(profileData);

        // Fetch recent bookings
        const bookingsResponse = await fetch(`http://beerescue.xyz:5000/api/booking/provider/${providerId}/bookings`);
        if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsResponse.json();
        
        // Sort bookings by date and take the 3 most recent
        const sortedBookings = bookingsData.bookings.sort((a: Booking, b: Booking) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 3);

        setRecentBookings(sortedBookings);
        setTotalBookings(bookingsData.total_bookings);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchDashboardData();
    }
  }, [isClient, router]);

  if (!isClient || loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
        <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Loading dashboard...</p>
      </div>
    );
  }

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
              Welcome back, {providerData?.business_name || 'Provider'}!
            </p>
          </div>
          <Link href="/provider/notifications">
            <button className="relative">
              <Bell className={`w-6 h-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <StatsCard
          title="Total Bookings"
          value={totalBookings}
          subtitle="All time"
          icon={Calendar}
          color="text-purple-500"
        />
        <StatsCard
          title="Total Customers"
          value={recentBookings.length}
          subtitle="Active"
          icon={Users}
          color="text-green-500"
        />
        <StatsCard
          title="Rating"
          value={providerData?.total_rating?.toFixed(1) || '0.0'}
          subtitle={`${providerData?.rating_count || 0} reviews`}
          icon={Star}
          color="text-yellow-500"
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
          {recentBookings.length > 0 ? (
            recentBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))
          ) : (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No recent bookings
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}