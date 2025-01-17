'use client'

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, Users, Calendar } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: Users,
      title: 'Expand Your Reach',
      description: 'Connect with thousands of potential customers in your area'
    },
    {
      icon: Calendar,
      title: 'Easy Scheduling',
      description: 'Manage your bookings and schedule with our intuitive platform'
    },
    {
      icon: Star,
      title: 'Build Your Reputation',
      description: 'Grow your business with customer ratings and reviews'
    }
  ];

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} px-4 py-16 sm:px-6 lg:px-8`}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-6 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Grow Your Service Business Online
          </h1>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of service providers who are growing their business with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/provider/register"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/provider/login"
              className={`${
                isDarkMode 
                  ? 'border-gray-700 hover:bg-gray-700' 
                  : 'border-gray-200 hover:bg-gray-50'
              } border px-8 py-3 rounded-lg font-medium transition-colors`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl font-bold text-center mb-12 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} px-4 py-16 sm:px-6 lg:px-8`}>
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl font-bold text-center mb-8 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Benefits of Joining
          </h2>
          <div className="space-y-4">
            {[
              'Access to a large customer base',
              'Automated booking and scheduling system',
              'Secure payment processing',
              'Marketing tools and insights',
              'Customer review management',
              '24/7 support'
            ].map((benefit, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                }`}
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className={`max-w-3xl mx-auto text-center ${
          isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
        } rounded-2xl p-8`}>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Ready to Start Growing Your Business?
          </h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join our platform today and reach more customers than ever before
          </p>
          <Link href="/provider/register"
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-t px-4 py-8`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2024 Service Provider Platform. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className={`text-sm ${
              isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
            }`}>
              Terms
            </Link>
            <Link href="/privacy" className={`text-sm ${
              isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
            }`}>
              Privacy
            </Link>
            <Link href="/contact" className={`text-sm ${
              isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
            }`}>
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}