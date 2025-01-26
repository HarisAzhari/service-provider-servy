  'use client';

  import React, { useState } from 'react';
  import { ArrowLeft, Upload, Trash2, AlertCircle, Clock, Plus } from 'lucide-react';
  import Link from 'next/link';
  import { useRouter } from 'next/navigation';
  import { useTheme } from '@/app/context/ThemeContext';
  import BottomNavigation from '@/app/components/navigation/BottomNavigation';

  interface FormData {
    title: string;
    category: string;
    custom_category: string;
    price: string;
    duration: string;
    location: string[];
    description: string;
    requirements: string;
    cancellationPolicy: string;
    total_rating?: number;  // Add this
    rating_count?: number;  // Add this
  }

  export default function AddServicePage() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<string | null>(null); // Changed from File to string
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<FormData>({
      title: '',
      category: '',
      custom_category: '', // Initialize the new field
      price: '',
      duration: '',
      location: [], // Change back to empty array
      description: '',
      requirements: '',
      cancellationPolicy: '24'
    });

    // Add these state variables at the top with your other useState declarations
const [suggestions, setSuggestions] = useState<Array<{
  place_id: number;
  display_name: string;
}>>([]);
const [isLoading, setIsLoading] = useState(false);

// Add this function to fetch suggestions
const fetchLocationSuggestions = async (query: string) => {
  if (query.length < 2) return; // Don't search for very short queries
  
  setIsLoading(true);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` + 
      `q=${encodeURIComponent(query)}+malaysia&` + // Adding 'malaysia' to focus on Malaysian results
      `format=json&` +
      `addressdetails=1&` +
      `limit=5`
    );
    
    if (!response.ok) throw new Error('Failed to fetch suggestions');
    
    const data = await response.json();
    setSuggestions(data);
  } catch (error) {
    console.error('Error fetching locations:', error);
    setSuggestions([]);
  } finally {
    setIsLoading(false);
  }
};

// Add this debounce function to prevent too many API calls
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Create a debounced version of the fetch function
const debouncedFetch = debounce(fetchLocationSuggestions, 300);

    // Predefined options
    const categories = [
      'Carpenter',
      'Cleaner',
      'Painter',
      'Electrician',
      'AC Repair',
      'Plumber',
      "Men's Salon",
      "Other"
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setErrors({ ...errors, image: 'Image must be less than 5MB' });
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setImage(base64String); // This is what we'll display
          setImageFile(base64String); // This is what we'll send to the server
          setErrors({ ...errors, image: '' });
        };
        reader.readAsDataURL(file);
      }
    };
  

    const validateForm = (): boolean => {
      const newErrors: { [key: string]: string } = {};


      if (!imageFile) newErrors.image = 'Service image is required';
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (formData.category === 'Other' && !formData.custom_category.trim()) {
        newErrors.custom_category = 'Custom category is required';
      }
      if (!formData.price.trim()) newErrors.price = 'Price is required';
      if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        newErrors.price = 'Please enter a valid price';
      }
      if (!formData.duration) newErrors.duration = 'Duration is required';
      if (formData.location.length === 0) {
        newErrors.location = 'At least one service area is required';
      }
          if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.description.length < 10) {
        newErrors.description = 'Description should be at least 10 characters';
      }
      if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm() || !imageFile) return;
      
      setLoading(true);
      try {
        const providerId = localStorage.getItem('provider_id');
        if (!providerId) {
          router.push('/provider/login');
          return;
        }
    
        const submitData = {
          provider_id: providerId,
          service_image: imageFile,
          service_title: formData.title,
          category: formData.category,
          custom_category: formData.category === 'Other' ? formData.custom_category : '', // Send the custom category separately
          price: Number(formData.price),
          duration: formData.duration,
          service_areas: formData.location,
          description: formData.description,
          customer_requirements: formData.requirements,
          cancellation_policy: `${formData.cancellationPolicy} hours notice required`,
        };
    
        
    
        const response = await fetch('http://127.0.0.1:5000/api/services/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error response:', errorData); // Log the error response
          throw new Error(errorData.message || 'Failed to create service');
        }
    
        router.push('/provider/services');
        } catch (error) {
          console.error('Full error details:', error);
          setErrors({
            ...errors,
            submit: error instanceof Error ? error.message : 'Failed to create service'
          });
        } finally {
          setLoading(false);
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

    const [locationInput, setLocationInput] = useState('');


    return (
      <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sticky top-0 z-10 shadow-sm`}>
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
              Add New Service
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
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
            onClick={() => {
              setImage(null);
              setImageFile(null);
            }}
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
  <div className="space-y-3">
    <select
      value={formData.category}
      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

    {formData.category === 'Other' && (
      <div className="mt-3">
        <input
          type="text"
          value={formData.custom_category}
          onChange={(e) => setFormData({ ...formData, custom_category: e.target.value })}
          placeholder="Enter your custom category"
          className={`w-full px-4 py-3 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-100 border-gray-700' 
              : 'bg-white text-gray-900 border-gray-300'
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.customCategory && (
          <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
            <AlertCircle className="w-4 h-4" />
            {errors.customCategory}
          </p>
        )}
      </div>
    )}
  </div>
))}

          {/* Price and Duration Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            {renderField('Price', errors.price, (
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  RM
                </span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg ${
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
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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
  <div className="relative">
    <div className="flex flex-wrap gap-2 mb-2">
      {formData.location.map((area, index) => (
        <div 
          key={index}
          className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-200' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          <span>{area}</span>
          <button
            type="button"
            onClick={() => {
              const newLocations = formData.location.filter((_, i) => i !== index);
              setFormData({ ...formData, location: newLocations });
              setLocationInput('');
            }}
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      ))}
    </div>
    <div className="relative">
      <input
        type="text"
        value={locationInput}
        onChange={(e) => {
          const value = e.target.value;
          setLocationInput(value);
          if (value.length >= 2) {
            debouncedFetch(value);
          } else {
            setSuggestions([]);
          }
        }}
        className={`w-full px-4 py-3 rounded-lg ${
          isDarkMode 
            ? 'bg-gray-800 text-gray-100 border-gray-700' 
            : 'bg-white text-gray-900 border-gray-300'
        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder="Search for service areas..."
      />
      {locationInput.length > 0 && (suggestions.length > 0 || isLoading) && (
        <div className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } border`}>
          {isLoading ? (
            <div className="px-4 py-2 text-gray-500">Loading...</div>
          ) : (
            suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                type="button"
                onClick={() => {
                  // Extract just the area name from the full address
                  const locationParts = suggestion.display_name.split(',');
                  const areaName = locationParts[0].trim();
                  
                  if (!formData.location.includes(areaName)) {
                    setFormData({
                      ...formData,
                      location: [...formData.location, areaName]
                    });
                  }
                  setLocationInput('');
                  setSuggestions([]);
                }}
                className={`w-full text-left px-4 py-2 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                {suggestion.display_name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
    <p className="mt-1 text-sm text-gray-500">
      Search and select multiple service areas
    </p>
  </div>
))}

          {/* Description */}
          {renderField('Description', errors.description, (
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="What should customers prepare or provide?"
          />
        ))}

        {/* Cancellation Policy */}
        {renderField('Cancellation Policy', errors.cancellationPolicy, (
          <select
            value={formData.cancellationPolicy}
            onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="24">24 hours notice required</option>
            <option value="48">48 hours notice required</option>
            <option value="72">72 hours notice required</option>
          </select>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-4 rounded-lg font-medium text-lg hover:bg-blue-600 transition-colors shadow-lg flex items-center justify-center gap-2 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <Clock className="w-5 h-5 animate-spin" />
              Creating Service...
            </>
          ) : (
            'Create Service'
          )}
        </button>

        {/* Tips Section */}
        <div className={`mt-8 p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
        }`}>
          <h3 className={`text-lg font-medium mb-3 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Tips for a Great Service Listing
          </h3>
          <ul className={`space-y-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Be specific about what's included in your service price</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Use high-quality, well-lit photos that showcase your work</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Clearly state any equipment or supplies you'll bring vs. what the customer needs to provide</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Mention your experience and any relevant certifications</span>
            </li>
          </ul>
        </div>
      </form>

      <BottomNavigation />
    </main>
  );
  }