'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, TrendingUp } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';

interface Booking {
  id: number;
  service_title: string;
  user_name: string;
  booking_date: string;
  booking_time: string;
  total_amount: number;
  created_at: string;
}

interface EarningsData {
  totalEarnings: number;
  completedBookings: Booking[];
}

export default function ProviderEarningsPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 0,
    completedBookings: []
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        if (!isClient) return;

        const providerId = localStorage.getItem('provider_id');
        if (!providerId) {
          router.push('/provider/login');
          return;
        }

        const response = await fetch(`http://127.0.0.1:5000/api/booking/provider/${providerId}/bookings?status=completed`);
        
        if (response.status === 401) {
          localStorage.removeItem('provider_id');
          localStorage.removeItem('provider_data');
          router.push('/provider/login');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch earnings data');

        const data = await response.json();
        const completedBookings = data.bookings;
        const totalEarnings = completedBookings.reduce((sum: number, booking: Booking) => 
          sum + booking.total_amount, 0
        );

        setEarningsData({
          totalEarnings,
          completedBookings
        });
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchEarnings();
    }
  }, [isClient, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isClient || loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
        <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Loading earnings...</p>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sticky top-0 z-10 shadow-sm`}>
        <div className="flex items-center gap-3">
          <Link href="/provider">
            <ChevronLeft className={`w-6 h-6 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`} />
          </Link>
          <h1 className={`text-xl font-semibold ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            My Earnings
          </h1>
        </div>
      </div>

      {/* Total Earnings Card */}
      <div className="p-4">
        <div className={`${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-xl p-6 text-white`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100">Total Earnings</p>
            <div className="bg-blue-400/30 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-1">RM {earningsData.totalEarnings.toFixed(2)}</h2>
          <p className="text-blue-100 text-sm">
            From {earningsData.completedBookings.length} completed bookings
          </p>
        </div>
      </div>

      {/* Completed Bookings List */}
      <div className="p-4">
        <h2 className={`font-semibold mb-4 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Completed Bookings
        </h2>

        <div className="space-y-4">
          {earningsData.completedBookings.length > 0 ? (
            earningsData.completedBookings.map((booking) => (
              <div 
                key={booking.id}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-sm`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-medium ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {booking.service_title}
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {booking.user_name}
                    </p>
                  </div>
                  <span className="font-bold text-green-500">
                    RM {booking.total_amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formatDate(booking.booking_date)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No completed bookings yet
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}