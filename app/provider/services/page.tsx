'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Search, Star, Power, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeContext';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';

interface Service {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  isActive: boolean;
  rating: number;
  reviews: number;
}

const ServiceCard = ({ service }: { service: Service }) => {
  const { isDarkMode } = useTheme();

  const handlePowerClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent card navigation
    e.stopPropagation(); // Prevent event bubbling
    // Handle power toggle
    console.log('Toggle power for service:', service.id);
  };

  return (
    <Link href={`/provider/services/${service.id}/edit`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl mb-4 cursor-pointer hover:shadow-md transition-all`}>
        <div className="flex gap-3">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {service.title}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                service.isActive 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className={`text-xs ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ({service.reviews})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-500 font-semibold">${service.price}</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePowerClick}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Power className={`w-4 h-4 ${
                    service.isActive ? 'text-green-500' : 'text-gray-500'
                  }`} />
                </button>
                <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ProviderServicesPage() {
  const { isDarkMode } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setServices([
        {
          id: 1,
          title: "Deep House Cleaning",
          price: 150,
          description: "Complete house cleaning service",
          image: "/api/placeholder/200/200",
          isActive: true,
          rating: 4.8,
          reviews: 156
        },
        {
          id: 2,
          title: "Kitchen Cleaning",
          price: 80,
          description: "Professional kitchen cleaning",
          image: "/api/placeholder/200/200",
          isActive: true,
          rating: 4.9,
          reviews: 98
        },
        {
          id: 3,
          title: "Bathroom Deep Clean",
          price: 60,
          description: "Thorough bathroom cleaning",
          image: "/api/placeholder/200/200",
          isActive: false,
          rating: 4.7,
          reviews: 72
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter services based on search term
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sticky top-0 z-10`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            My Services
          </h1>
          <Link href="/provider/services/new">
            <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
              <Plus className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services"
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-100 placeholder-gray-400' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      {/* Services List */}
      <div className="p-4">
        {loading ? (
          // Loading skeletons
          [...Array(3)].map((_, index) => (
            <div 
              key={index}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl mb-4`}
            >
              <div className="flex gap-3">
                <div className={`w-20 h-20 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                } animate-pulse`} />
                <div className="flex-1">
                  <div className={`w-3/4 h-5 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  } rounded mb-2 animate-pulse`} />
                  <div className={`w-1/2 h-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  } rounded mb-2 animate-pulse`} />
                  <div className={`w-1/4 h-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  } rounded animate-pulse`} />
                </div>
              </div>
            </div>
          ))
        ) : (
          filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No services found
            </div>
          )
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}