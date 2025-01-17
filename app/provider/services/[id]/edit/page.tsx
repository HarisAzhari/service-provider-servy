'use client'

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Trash2, AlertCircle, Clock, DollarSign, Power } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';

interface FormErrors {
  [key: string]: string;
}

interface ServiceForm {
  title: string;
  category: string;
  price: string;
  duration: string;
  location: string[];
  description: string;
  requirements: string;
  isActive: boolean;
}

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ServiceForm>({
    title: '',
    category: '',
    price: '',
    duration: '',
    location: [],
    description: '',
    requirements: '',
    isActive: true
  });

  // Predefined options (same as your current services)
  const categories = [
    'Carpenter',
    'Cleaner',
    'Painter',
    'Electrician',
    'AC Repair',
    'Plumber',
    "Men's Salon"
  ];

  const locations = [
    'Manhattan',
    'Brooklyn',
    'Queens',
    'Bronx',
    'Staten Island'
  ];

  const durations = [
    '1 hour',
    '2 hours',
    '3 hours',
    '4 hours',
    '5 hours',
    '6 hours',
    '7 hours',
    '8 hours'
  ];

  useEffect(() => {
    // Simulated API call to fetch service data
    setTimeout(() => {
      // This would be your actual API call to get service data
      setFormData({
        title: "Deep House Cleaning",
        category: "Cleaner",
        price: "150",
        duration: "3 hours",
        location: ["Manhattan", "Brooklyn"],
        description: "Complete house cleaning service",
        requirements: "Cleaning supplies provided by us",
        isActive: true
      });
      setImage("/api/placeholder/200/200");
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({...errors, image: 'Image must be less than 5MB'});
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setErrors({...errors, image: ''});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationChange = (loc: string) => {
    const newLocations = formData.location.includes(loc)
      ? formData.location.filter(l => l !== loc)
      : [...formData.location, loc];
    setFormData({...formData, location: newLocations});
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (formData.location.length === 0) newErrors.location = 'Select at least one location';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStatusToggle = async () => {
    try {
      // Here you would update the status in your backend
      setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Here you would handle the form submission to your backend
      console.log('Form submitted:', { ...formData, image });
      router.push('/provider/services');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({...errors, submit: 'Failed to update service. Please try again.'});
    }
  };

  const renderField = (label: string, error: string | undefined, children: React.ReactNode) => (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${
        isDarkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
        <div className="animate-pulse space-y-4">
          <div className={`h-8 w-1/2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          <div className={`h-48 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          <div className={`h-10 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          <div className={`h-10 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sticky top-0 z-10 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className={`text-xl font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Edit Service
            </h1>
          </div>
          <button
            onClick={handleStatusToggle}
            className={`p-2 rounded-lg ${
              formData.isActive
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            <Power className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Status Banner */}
        <div className={`p-3 rounded-lg ${
          formData.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          <p className="text-sm font-medium">
            Status: {formData.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>

        {/* Image Upload */}
        {renderField('Service Image', errors.image, (
          <div className="relative">
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Service preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-gray-500 bg-gray-800' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className={`w-10 h-10 mb-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Upload a high-quality image (max 5MB)
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        ))}

        {/* Title */}
        {renderField('Service Title', errors.title, (
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className={`w-full px-4 py-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., Professional Deep House Cleaning"
          />
        ))}

        {/* Category */}
        {renderField('Category', errors.category, (
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className={`w-full px-4 py-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        ))}

        {/* Price and Duration Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          {renderField('Price', errors.price, (
            <div className="relative">
              <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          ))}

          {/* Duration */}
          {renderField('Duration', errors.duration, (
            <div className="relative">
              <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select</option>
                {durations.map((dur) => (
                  <option key={dur} value={dur}>{dur}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Service Area */}
        {renderField('Service Area', errors.location, (
          <div className="grid grid-cols-2 gap-2">
            {locations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => handleLocationChange(loc)}
                className={`p-3 rounded-lg border ${
                  formData.location.includes(loc)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        ))}

        {/* Description */}
        {renderField('Description', errors.description, (
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Describe your service in detail..."
          />
        ))}

        {/* Requirements */}
        {renderField('Customer Requirements', errors.requirements, (
          <textarea
            value={formData.requirements}
            onChange={(e) => setFormData({...formData, requirements: e.target.value})}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="What should customers prepare or provide?"
          />
        ))}

        {/* Delete Service */}
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <h3 className={`text-lg font-medium mb-2 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Delete Service
          </h3>
          <p className={`text-sm mb-3 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            This action cannot be undone. All bookings and reviews associated with this service will be permanently deleted.
          </p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
                // Handle service deletion
                console.log('Deleting service:', params.id);
                router.push('/provider/services');
              }
            }}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Delete Service
          </button>
        </div>

        {/* Submit Button */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 -mx-4 mt-6`}>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium text-lg hover:bg-blue-600 transition-colors shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </form>

      <BottomNavigation />
    </main>
  )
}