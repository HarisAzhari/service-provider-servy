'use client'
import React, { useState, useEffect } from 'react';
import { Search, Clock, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';

type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' | 'paid_deposit';

interface Booking {
  id: number;
  user_id: number;
  service_id: number;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  total_amount: number;
  booking_notes: string;
  created_at: string;
  service_title: string;
  service_image: string;
  user_name: string;
  user_mobile: string;
  user_image: string;
}

export default function ProviderBookingsPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Add isClient check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add click handler for the booking card
  const handleBookingClick = (booking: Booking) => {
    if (booking.status === 'approved' || booking.status === 'paid_deposit') {
      router.push(`/provider/bookings/${booking.id}`);
    }
  };
  

  // Updated fetch bookings with authentication
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!isClient) return;

        const providerId = localStorage.getItem('provider_id');
        const storedData = localStorage.getItem('provider_data');

        if (!providerId || !storedData) {
          console.log('No stored data found, redirecting to login...');
          router.push('/provider/login');
          return;
        }

        const response = await fetch(`http://127.0.0.1:5000/api/booking/provider/${providerId}/bookings`);
        
        if (response.status === 401) {
          console.log('Unauthorized, redirecting to login...');
          localStorage.removeItem('provider_id');
          localStorage.removeItem('provider_data');
          router.push('/provider/login');http://localhost:5000 
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data.bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchBookings();
    }
  }, [isClient, router]);

  const tabs: Array<{ key: BookingStatus | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'paid_deposit', label: 'Paid Deposit' }
  ];

  const getStatusColor = (status: BookingStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800',
      paid_deposit: 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: BookingStatus): string => {
    const labels = {
      pending: 'Pending',
      approved: 'Approved',
      completed: 'Completed',
      cancelled: 'Cancelled',
      rejected: 'Rejected',
      paid_deposit: 'Paid Deposit'
    };
    return labels[status];
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = activeTab === 'all' || booking.status === activeTab;
    const matchesSearch = booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service_title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Updated handleStatusChange with authentication
  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      const providerId = localStorage.getItem('provider_id');
      
      if (!providerId) {
        console.log('No provider ID found, redirecting to login...');
        router.push('/provider/login');
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/api/booking/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.status === 401) {
        console.log('Unauthorized, redirecting to login...');
        localStorage.removeItem('provider_id');
        localStorage.removeItem('provider_data');
        router.push('/provider/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to update booking status');

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // Add initial client-side check
  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
        <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Loading bookings...</p>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sticky top-0 z-10`}>
        <h1 className={`text-xl font-semibold mb-4 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          My Bookings
        </h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-100 placeholder-gray-400' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-2 pb-2 hide-scrollbar">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                activeTab === key
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-4 space-y-4">
        {filteredBookings.map((booking) => (
          <div 
            key={booking.id}
            onClick={() => handleBookingClick(booking)}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm ${
              (booking.status === 'approved' || booking.status === 'paid_deposit') ? 'cursor-pointer hover:opacity-90' : ''
            }`}
          >
            {/* Customer Info */}
            <div className="flex items-center gap-3 mb-3">
  <img 
    src={booking.user_image || "/default-avatar.png"}  // Use default-avatar.png as fallback
    alt={booking.user_name}
    className="w-10 h-10 rounded-full object-cover bg-gray-200"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null; // Prevent infinite loop
      target.src = "/default-avatar.png"; // Fallback if user_image fails to load
    }}
  />
  <div className="flex-1">
    <h3 className={`font-medium ${
      isDarkMode ? 'text-gray-100' : 'text-gray-900'
    }`}>
      {booking.user_name}
    </h3>
    <p className={`text-sm ${
      isDarkMode ? 'text-gray-400' : 'text-gray-500'
    }`}>
      {booking.service_title}
    </p>
  </div>
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
    {getStatusLabel(booking.status)}
  </span>
</div>

            {/* Booking Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {new Date(booking.booking_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {booking.booking_time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Contact: {booking.user_mobile}
                </span>
              </div>
              {booking.booking_notes && (
                <div className={`mt-2 p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>Notes:</strong> {booking.booking_notes}
                  </p>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Total Amount: <span className="text-blue-500">RM{booking.total_amount}</span>
              </p>
            </div>

            {/* Actions for pending bookings */}
            {booking.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(booking.id, 'approved');
                  }}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(booking.id, 'rejected');
                  }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No bookings found
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}