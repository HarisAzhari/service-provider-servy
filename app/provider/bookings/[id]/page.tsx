'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Calendar, Clock, MapPin, User, Phone } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

interface BookingDetails {
  id: number;
  user_id: number;
  service_id: number;
  booking_date: string;
  booking_time: string;
  status: string;
  total_amount: number;
  booking_notes: string;
  created_at: string;
  service_title: string;
  service_image: string;
  user_name: string;
  user_mobile: string;
}

export default function ProviderBookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
  const resolvedParams = React.use(params);
  const { isDarkMode } = useTheme();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`http://beerescue.xyz:5000/api/booking/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Failed to fetch booking details');
        const data = await response.json();
        setBooking(data.booking);  // Access the nested booking object
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookingDetails();
  }, [resolvedParams.id]);

  const handleComplete = async () => {
    if (!booking) return;
    
    try {
      const response = await fetch(`http://beerescue.xyz:5000/api/booking/${booking.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'completed' })
      });

      if (!response.ok) throw new Error('Failed to complete booking');
      
      router.push('/provider/bookings');
    } catch (error) {
      console.error('Error completing booking:', error);
    }
  };

  if (loading || !booking) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
        <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Loading booking details...</p>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sticky top-0 z-10 flex items-center`}>
        <button 
          onClick={() => router.back()}
          className={`mr-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Booking Details
        </h1>
      </div>

      <div className="p-4">
        {/* Service Info */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 mb-4`}>
          <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {booking.service_title}
          </h2>
          <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block mb-4 
  ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
    'bg-gray-100 text-gray-800'}`}>
  {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
</div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {new Date(booking.booking_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {booking.booking_time}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 mb-4`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Customer Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {booking.user_name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-500" />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {booking.user_mobile}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Service Location
              </span>
            </div>
          </div>
        </div>

        {/* Price Info */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 mb-4`}>
          <div className="flex justify-between items-center">
            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Amount
            </span>
            <span className="text-xl font-bold text-blue-500">
              RM{booking.total_amount}
            </span>
          </div>
        </div>

        {/* Complete Button */}
        {(booking.status === 'approved' || booking.status === 'paid_deposit') && (
          <button
            onClick={handleComplete}
            className="w-full bg-green-500 text-white py-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Complete Service
          </button>
        )}
      </div>
    </main>
  );
}