'use client'

import React, { useState } from 'react';
import { Search, Clock, MapPin, Calendar } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

interface Booking {
  id: number;
  customerName: string;
  customerImage: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: BookingStatus;
}

export default function ProviderBookingsPage() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample bookings data (replace with actual data from your backend)
  const [bookings] = useState<Booking[]>([
    {
      id: 1,
      customerName: "John Smith",
      customerImage: "/api/placeholder/40/40",
      service: "Deep House Cleaning",
      date: "2024-01-16",
      time: "10:00 AM",
      location: "123 Main St, Brooklyn",
      price: 150,
      status: 'pending'
    },
    {
      id: 2,
      customerName: "Sarah Wilson",
      customerImage: "/api/placeholder/40/40",
      service: "Kitchen Cleaning",
      date: "2024-01-16",
      time: "2:00 PM",
      location: "456 Park Ave, Manhattan",
      price: 80,
      status: 'confirmed'
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      customerImage: "/api/placeholder/40/40",
      service: "Deep House Cleaning",
      date: "2024-01-15",
      time: "11:00 AM",
      location: "789 Broadway, Queens",
      price: 150,
      status: 'completed'
    }
  ]);

  const tabs: Array<{ key: BookingStatus | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'rejected', label: 'Rejected' }
  ];

  const getStatusColor = (status: BookingStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = activeTab === 'all' || booking.status === activeTab;
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
    // Here you would handle the status change in your backend
    console.log(`Changing booking ${bookingId} status to ${newStatus}`);
  };

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
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm`}
          >
            {/* Customer Info */}
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={booking.customerImage} 
                alt={booking.customerName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h3 className={`font-medium ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {booking.customerName}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {booking.service}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>

            {/* Booking Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {new Date(booking.date).toLocaleDateString('en-US', {
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
                  {booking.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {booking.location}
                </span>
              </div>
            </div>

            {/* Actions */}
            {booking.status === 'pending' && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleStatusChange(booking.id, 'confirmed')}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusChange(booking.id, 'rejected')}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600"
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