import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ResponsiveNavbar = ({ title = "VARK", language, setLanguage, disable = true }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleProfileSidebar = () => {
    setProfileSidebarOpen(!profileSidebarOpen);
  };
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
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
                className="p-2 cursor-pointer rounded-md text-gray-600 hover:text-gray-900 focus:outline-none md:hidden"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to="/">
              <div className="ml-1 md:ml-0 font-bold text-lg text-gray-800">{title || 'Learning Platform'}</div>
              </Link>
            </div>
            
            <div className="flex items-center">
              <div className="mr-3">
                <button 
                  onClick={toggleLanguage}
                  className="cursor-pointer relative inline-flex items-center px-2 py-1.5 border border-gray-200 transition-all duration-200"
                  aria-label="Toggle language"
                >
                  <div className={`flex items-center justify-center transition-all duration-300 ${language === 'en' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    <span className="text-xs">EN</span>
                  </div>
                  <div className="mx-1 text-gray-300">|</div>
                  <div className={`flex items-center justify-center transition-all duration-300 ${language === 'mr' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    <span className="text-xs">मराठी</span>
                  </div>
                  <span 
                    className={`absolute bottom-0 h-0.5 bg-orange-400 transition-all duration-300 ${language === 'en' ? 'left-1 w-5' : 'left-9 w-7'}`}
                  ></span>
                </button>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                {!isAuthenticated ? (
                  <>
                  <Link to='/sign' state={{ language:language, signIn: true }}>
                    <button 
                      onClick={handleSignIn}
                      className={(disable)?"hidden":"" + "cursor-pointer px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"}
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link to='/sign' state={{ language:language, signIn: false }}>
                    <button 
                      onClick={handleSignUp}
                      className={(disable)?"hidden":"" + "cursor-pointer px-4 py-2 bg-orange-400 rounded-md text-sm font-medium text-white hover:bg-orange-500"}
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
              {/* <div className="flex justify-center mb-2">
                <button 
                  onClick={toggleLanguage}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${language === 'en' ? 'text-orange-500' : 'text-gray-500'}`}>EN</span>
                    <div className="h-4 w-4 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L12 20" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${language === 'mr' ? 'text-orange-500' : 'text-gray-500'}`}>मराठी</span>
                  </div>
                </button>
              </div> */}
              
              <Link to='/sign' state={{ language:language, signIn: true }}>
              <button 
                onClick={handleSignIn}
                className={(disable)?"hidden":"" + "cursor-pointer w-full px-4 py-3 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium mb-2"}
              >
                Sign In
              </button>
              </Link>
              <Link to='/sign' state={{ language:language, signIn: false }}>
              <button 
                onClick={handleSignUp}
                className={(disable)?"hidden":"" + "cursor-pointer w-full px-4 py-3 rounded-md bg-orange-400 text-white hover:bg-orange-500 font-medium"}
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
            <div className="flex justify-center mb-4">
              <button 
                onClick={toggleLanguage}
                className="cursor-pointer relative inline-flex items-center px-6 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className={`text-sm ${language === 'en' ? 'font-bold text-orange-500' : 'text-gray-500'}`}>EN</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className={`text-sm ${language === 'mr' ? 'font-bold text-orange-500' : 'text-gray-500'}`}>मराठी</span>
              </button>
            </div>
            
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
              <button className="cursor-pointer w-full text-left p-3 rounded-md hover:bg-gray-100 flex items-center">
                <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Dashboard
              </button>
              <button 
                onClick={handleSignOut}
                className="cursor-pointer w-full text-left p-3 rounded-md hover:bg-gray-100 flex items-center text-red-500"
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