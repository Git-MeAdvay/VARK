import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

const ResponsiveNavbar = ({ title = "" }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  

  const toggleProfileSidebar = () => {
    setProfileSidebarOpen(!profileSidebarOpen);
  };
  
  
  const handleSignIn = () => {
    setIsAuthenticated(true);
    setSidebarOpen(false);
  };
  

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setSidebarOpen(false);
  };
  
  
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setProfileSidebarOpen(false);
  };
  
  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Hamburger menu */}
              <button 
                onClick={isAuthenticated ? toggleProfileSidebar : toggleSidebar}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none md:hidden"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to="/">
              <div className="ml-1 md:ml-0 font-bold text-lg text-gray-800">{title || 'Learning Platform'}</div>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                <Link to='/sign'>
                  <button 
                    onClick={handleSignIn}
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleSignUp}
                    className="px-4 py-2 bg-orange-400 rounded-md text-sm font-medium text-white hover:bg-orange-500"
                  >
                    Sign Up
                  </button>
                  </Link>
                </>
              ) : (
                <button 
                  onClick={toggleProfileSidebar}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span>Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {!isAuthenticated && (
        <div 
          className={`md:hidden fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-bold text-lg">Menu</h2>
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <div className="flex flex-col space-y-3">
              <Link to='/sign'>
              <button 
                onClick={handleSignIn}
                className="w-full px-4 py-3 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={handleSignUp}
                className="w-full px-4 py-3 rounded-md bg-orange-400 text-white hover:bg-orange-500 font-medium"
              >
                Sign Up
              </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {isAuthenticated && (
        <div 
          className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
            profileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-bold text-lg">Profile</h2>
            <button 
              onClick={toggleProfileSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">User Name</h3>
              <p className="text-gray-600 text-sm">user@example.com</p>
            </div>
            
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 flex items-center">
                <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
              </button>
              <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 flex items-center">
                <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 flex items-center">
                <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                My Courses
              </button>
              <button 
                onClick={handleSignOut}
                className="w-full text-left p-3 rounded-md hover:bg-gray-100 flex items-center text-red-500"
              >
                <svg className="h-5 w-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      
      {(sidebarOpen || profileSidebarOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={isAuthenticated ? toggleProfileSidebar : toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default ResponsiveNavbar;