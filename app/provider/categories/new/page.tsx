'use client'

import React, { useState } from 'react';
import { ArrowLeft, Upload, Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';

interface FormErrors {
  [key: string]: string;
}

interface CategoryForm {
  name: string;
  path: string;
  icon: string;
}

export default function AddCategoryPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    path: '',
    icon: ''
  });

  // Common emoji icons that might be relevant for service categories
  const commonIcons = ['🔨', '🧹', '🎨', '⚡', '❄️', '🔧', '✂️', '🚿', '🏠', '🔌', '🚰', '🎭', '📱', '🖥️', '🚗'];

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!image) newErrors.image = 'Category image is required';
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!formData.path.trim()) newErrors.path = 'URL path is required';
    if (!formData.icon) newErrors.icon = 'Please select an icon';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Here you would handle the form submission to your backend
      console.log('Form submitted:', { ...formData, image });
      router.push('/provider/categories');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({...errors, submit: 'Failed to create category. Please try again.'});
    }
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      path: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    });
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
            Add New Category
          </h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Image Upload */}
        {renderField('Category Image', errors.image, (
          <div className="relative">
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Category preview" 
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
                    Upload a category icon (max 5MB)
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

        {/* Category Name */}
        {renderField('Category Name', errors.name, (
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., Home Cleaning"
          />
        ))}

        {/* URL Path */}
        {renderField('URL Path', errors.path, (
          <input
            type="text"
            value={formData.path}
            onChange={(e) => setFormData({...formData, path: e.target.value})}
            className={`w-full px-4 py-3 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., home-cleaning"
          />
        ))}

        {/* Icon Selection */}
        {renderField('Category Icon', errors.icon, (
          <div className="grid grid-cols-5 gap-2">
            {commonIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({...formData, icon})}
                className={`p-3 text-2xl rounded-lg border ${
                  formData.icon === icon
                    ? 'bg-blue-500 text-white border-blue-500'
                    : isDarkMode
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium text-lg hover:bg-blue-600 transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          Create Category
        </button>

        {/* Tips Section */}
        <div className={`mt-8 p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
        }`}>
          <h3 className={`text-lg font-medium mb-3 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Tips for Category Creation
          </h3>
          <ul className={`space-y-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Choose a clear, descriptive name that users will easily understand</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Use a simple, relevant icon that represents the category well</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Keep URL paths short and easy to read, using only lowercase letters and hyphens</span>
            </li>
          </ul>
        </div>
      </form>

      <BottomNavigation />
    </main>
  );
}