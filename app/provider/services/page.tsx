'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Star, Power, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Service {
  id: number;
  provider_id: number;
  service_title: string;
  category: string;
  price: number;
  duration: string;
  service_areas: string[];
  description: string;
  customer_requirements: string;
  cancellation_policy: string;
  service_image: string;
  status: boolean; // Changed from isActive to status to match backend
  total_rating: number | null;
  rating_count: number;
}

interface ServiceCardProps {
  service: Service;
  onToggleActive: (id: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onToggleActive }) => {
  console.log('Service rating data:', {
    total_rating: service.total_rating,
    rating_count: service.rating_count
  });

  const { isDarkMode } = useTheme();

  const handlePowerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleActive(service.id);
  };

  const renderStars = (rating: number | null, count: number) => {
    if (!rating && count === 0) {
      return (
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
            size={16}
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
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {rating ? ` ${rating.toFixed(1)} (${count})` : ''}
        </span>
      </div>
    );
  };


  return (
    <Link href={`/provider/services/${service.id}/edit`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl mb-4 cursor-pointer hover:shadow-md transition-all`}>
        <div className="flex gap-3">
          <div className="relative w-20 h-20">
            {service.service_image ? (
              <img 
                src={service.service_image}
                alt={service.service_title}
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No Image
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {service.service_title}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                service.status 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {service.status ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="mb-1">
              {renderStars(service.total_rating, service.rating_count)}
            </div>

            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {service.category} • {service.duration}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-blue-500 font-semibold">RM{service.price}</span>
                <span className={`text-sm ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {service.service_areas.join(', ')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePowerClick}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <Power className={`w-4 h-4 ${
                    service.status ? 'text-green-500' : 'text-gray-500'
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

const LoadingSkeleton: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl mb-4`}>
    <div className="flex gap-3">
      <div className="w-20 h-20 rounded-lg bg-gray-300 animate-pulse" />
      <div className="flex-1">
        <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-2" />
        <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse mb-2" />
        <div className="flex justify-between items-center">
          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-300 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export default function ProviderServicesPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const providerId = localStorage.getItem('provider_id');
        if (!providerId) {
          router.push('/provider/login');
          return;
        }

        // Using the general services endpoint
        const response = await fetch('http://127.0.0.1:5000/api/services');
        
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('provider_id');
            localStorage.removeItem('provider_data');
            router.push('/provider/login');
            return;
          }
          throw new Error('Failed to fetch services');
        }
        
        const data = await response.json();
        
        if (data.services && Array.isArray(data.services)) {
          // Filter services for current provider
          const providerServices = data.services.filter(
            (            service: { provider_id: number; }) => service.provider_id === parseInt(providerId)
          );
          setServices(providerServices);
        } else {
          console.error('Invalid data format received:', data);
          setError('Invalid data format received from server');
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [router]);

  const handleToggleActive = async (serviceId: number) => {
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      const response = await fetch(`http://127.0.0.1:5000/api/services/${serviceId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      const result = await response.json();

      setServices(prevServices => 
        prevServices.map(s => 
          s.id === serviceId ? { ...s, status: result.status } : s
        )
      );
    } catch (error) {
      console.error('Error updating service:', error);
      setError(error instanceof Error ? error.message : 'Failed to update service');
    }
  };

  const filteredServices = services.filter(service => 
    service.service_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sticky top-0 z-10 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            My Services
          </h1>
          <Link href="/provider/services/new">
            <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </Link>
        </div>

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

      {error && (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <LoadingSkeleton key={n} isDarkMode={isDarkMode} />
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service}
              onToggleActive={handleToggleActive}
            />
          ))
        ) : (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {searchTerm ? 'No matching services found' : 'No services yet'}
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}