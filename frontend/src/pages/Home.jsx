import { Link } from "react-router-dom";

const LearningStyleAssessment = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full p-4 bg-white shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="font-bold">☰</span>
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          </div>
        </nav>
  
        {/* Main Content */}
        <div className="max-w-2xl w-full flex flex-col items-center text-center mt-16">
          {/* Illustration */}
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute inset-0 bg-orange-100 rounded-full opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Person */}
                <div className="relative">
                  {/* Body */}
                  <div className="w-24 h-32 bg-orange-400 rounded-t-full absolute left-4 top-6"></div>
                  <div className="w-16 h-24 bg-olive-600 rounded-lg absolute left-8 top-24"></div>
                  
                  {/* Head */}
                  <div className="w-12 h-12 bg-gray-800 rounded-lg absolute left-10 top-0">
                    <div className="w-2 h-1 bg-white rounded-full absolute right-2 top-4"></div>
                  </div>
  
                  {/* Computer */}
                  <div className="w-16 h-12 border-2 border-gray-300 bg-white absolute right-0 top-8">
                    <div className="w-8 h-6 flex items-center justify-center absolute left-4 top-2">
                      <div className="w-6 h-4 bg-gray-800 transform rotate-12"></div>
                      <div className="w-1 h-1 bg-yellow-400 absolute right-0 bottom-0"></div>
                    </div>
                  </div>
  
                  {/* Books */}
                  <div className="h-4 w-12 bg-green-600 absolute right-2 top-24"></div>
                  <div className="h-3 w-10 bg-red-400 absolute right-3 top-28"></div>
  
                  {/* Hourglass */}
                  <div className="absolute left-0 bottom-4">
                    <div className="w-4 h-1 bg-yellow-600 rounded-full"></div>
                    <div className="w-2 h-6 bg-yellow-100 mx-auto border border-yellow-600"></div>
                    <div className="w-4 h-1 bg-yellow-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Text Content */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Learning Style Assessment</h1>
          <p className="text-gray-600 mb-8 px-4">
            Unlock your potential by discovering your unique learning style. Improve your study habits and 
            academic performance with a personalized assessment designed to highlight how you learn best.
          </p>
  
          {/* CTA Button */}
          <Link to="/form">
          <button 
            className="px-6 py-3 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors duration-300 shadow-md"
          >
            Let's Find Out
          </button>
          </Link>
        </div>
      </div>
    );
  };
  
  export default LearningStyleAssessment;