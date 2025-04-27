import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signin,signup } from '../api/login';

const AuthComponent = ({ language }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();


  const gotoDashboard = (user) => {
    navigate('/dashboard', { state: { user:user } });
  }

  useEffect(() => {
    const { state } = location;
    if (state && state.signIn) {
      setActiveTab('signin');
    } else if (state && !state.signIn) {
      setActiveTab('signup');
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (activeTab === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // console.log('Form submitted:', activeTab, formData);
      
      if (activeTab === 'signin') {
        const data = await signin({
          email: formData.email,
          passWord: formData.password
        });
        // console.log(data);
        if (data.success) {
          // alert('Sign in successful!');
          // console.log(data);
          gotoDashboard(data.user.auth);
        } else {
          setErrors({ general: data.message });
        }
      } else {
        const data = await signup({
          name: formData.name,
          email: formData.email,
          passWord: formData.password
        });
        // console.log(data);
        if (data.success) {
          // alert('Sign Up successful!');
          gotoDashboard(data.user.auth);
        } else {
          setErrors({ general: data.message });
        }
      }
    } catch (error) {
      setErrors({
        general: 'Authentication failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Switch tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium text-sm flex-1 ${
                activeTab === 'signin'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => switchTab('signin')}
            >
              Sign In
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm flex-1 ${
                activeTab === 'signup'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => switchTab('signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="mb-4 p-3 text-sm bg-red-100 text-red-600 rounded-md">
              {errors.general}
            </div>
          )}
          
          {/* Name field - only for signup */}
          {activeTab === 'signup' && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:ring-orange-500 focus:border-orange-500`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
          )}
          
          {/* Email field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:ring-orange-500 focus:border-orange-500`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          {/* Password field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:ring-orange-500 focus:border-orange-500`}
                placeholder={activeTab === 'signup' ? "Create a password" : "Enter your password"}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          
          {/* Confirm Password field - only for signup */}
          {activeTab === 'signup' && (
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:ring-orange-500 focus:border-orange-500`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          )}
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-400 text-white py-2 px-4 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <span>{activeTab === 'signin' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>
        
        {/* Social sign in options */}
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Google
            </button>
            <button
              type="button"
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Apple
            </button>
          </div>
        </div> */}
        
        {/* Terms and conditions */}
        <div className="mt-6 text-center text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <a href="#" className="text-orange-500 hover:text-orange-600">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-orange-500 hover:text-orange-600">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;