import { Link } from "react-router-dom";

const LearningStyleAssessment = ({ language }) => {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <nav className="fixed top-0 left-0 w-full p-4 bg-white shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="font-bold">☰</span>
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          </div>
        </nav>
  
        <div className="max-w-2xl w-full flex flex-col items-center text-center mt-16">
  
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{language === 'en' ? ("Learning Style Assessment") : ("शिकण्याच्या शैलीचे मूल्यांकन")}</h1>
          <p className="text-gray-600 mb-8 px-4">
            {language === 'en' ? ("Unlock your potential by discovering your unique learning style. Improve your study habits and academic performance with a personalized assessment designed to highlight how you learn best.") : ("तुमच्या अद्वितीय शिक्षण शैलीचा शोध घेऊन तुमच्या क्षमतेचे ताळे उघडा. तुम्ही कसे सर्वोत्तम शिकता हे दाखवण्यासाठी डिझाइन केलेल्या वैयक्तिकृत मूल्यांकनासह तुमच्या अभ्यासाच्या सवयी आणि शैक्षणिक कामगिरी सुधारा.")}
          </p>
  
          <Link to="/form">
          <button
            className="cursor-pointer px-6 py-3 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors duration-300 shadow-md"
          >
            {language === 'en' ? ("Let's Find Out") : ("चला शोधूया")}
          </button>
          </Link>
        </div>
      </div>
    );
  };
  
  export default LearningStyleAssessment;