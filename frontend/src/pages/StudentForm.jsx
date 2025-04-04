import { useState, useEffect } from 'react';
import { createTest } from '../api/test';
import varkQuestions from '../tesr_data/varkQuestions';

const VARKAssessment = () => {
  const [currentStep, setCurrentStep] = useState('auth'); // 'auth', 'intro', 'questions', 'results'
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [response,setResponse] = useState([]);
  const [name, setName] = useState('test');
  const [Id, setId] = useState('test');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authCode.trim() === '') {
      setAuthError('Please enter an authentication code');
      return;
    }
    
    if (authCode === '123456') { // Demo auth code for testing
      setAuthError('');
      setCurrentStep('intro');
    } else {
      setAuthError('Invalid authentication code');
    }
  };

  const startAssessment = () => {
    setCurrentStep('questions');
  };

  useEffect(() => {
    const interact = async () => {
      if(currentStep === 'results') {
        const data = await createTest({
          name:name,
          auth:authCode,
          Id:Id,
          testData:response,
        });
    
        if(!data.success) {
          if(data.message) alert(data.message);
          return;
        }
      }
    };
    interact();
  }, [currentStep]);

  const handleAnswerSelect = (questionIndex, answerType) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerType;
    const newResponse = [...response];
    newResponse[questionIndex] = {
      question: varkQuestions[questionIndex].question,
      answer: answerType
    };
    setAnswers(newAnswers);
    setResponse(newResponse);
    
    setIsAnimating(true);
    
    setTimeout(() => {
      if (currentQuestion < varkQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults(newAnswers);
      }
      
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [currentQuestion]);

  const calculateResults = async (finalAnswers) => {
    const scores = {
      V: 0, // Visual
      A: 0, // Aural
      R: 0, // Read/Write
      K: 0  // Kinesthetic
    };
    
    finalAnswers.forEach(answer => {
      if (answer) {
        scores[answer]++;
      }
    });
    
    setResults(scores);
    setCurrentStep('results');
  };

  const styleDescriptions = {
    V: "Visual learners prefer to see information presented in visual formats such as charts, graphs, maps, diagrams, and demonstrations.",
    A: "Aural learners learn best by listening and speaking. They benefit from lectures, discussions, and talking things through.",
    R: "Read/Write learners prefer information displayed as words. They learn best from reading texts and writing notes.",
    K: "Kinesthetic learners learn through experience and practice. They prefer hands-on activities and learn by doing."
  };

  const getDominantStyle = () => {
    if (!results) return null;
    
    let dominantStyle = 'V';
    let highestScore = results.V;
    
    if (results.A > highestScore) {
      dominantStyle = 'A';
      highestScore = results.A;
    }
    if (results.R > highestScore) {
      dominantStyle = 'R';
      highestScore = results.R;
    }
    if (results.K > highestScore) {
      dominantStyle = 'K';
      highestScore = results.K;
    }
    
    return dominantStyle;
  };

  const renderAuthScreen = () => (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">VARK Learning Style Assessment</h2>
      <p className="mb-6 text-gray-600">Please enter your authentication code to begin the assessment.</p>
      
      <form onSubmit={handleAuthSubmit}>
        <div className="mb-4">
          <label htmlFor="authCode" className="block text-sm font-medium text-gray-700 mb-1">Authentication Code</label>
          <input
            type="text"
            id="authCode"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            placeholder="Enter your code"
          />
          {authError && <p className="mt-2 text-sm text-red-600">{authError}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full bg-orange-400 text-white py-2 px-4 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        >
          Verify Code
        </button>
      </form>
    </div>
  );

  const renderIntroScreen = () => (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">VARK Learning Style Assessment</h2>
      
      <div className="mb-6">
        <p className="mb-4 text-gray-600">
          The VARK model helps identify your preferred learning style:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-blue-700">Visual (V)</h3>
            <p className="text-sm">You prefer using images, pictures, and spatial understanding</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md">
            <h3 className="font-semibold text-green-700">Aural (A)</h3>
            <p className="text-sm">You prefer using sound and music</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-md">
            <h3 className="font-semibold text-purple-700">Read/Write (R)</h3>
            <p className="text-sm">You prefer using words, reading and writing</p>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-md">
            <h3 className="font-semibold text-amber-700">Kinesthetic (K)</h3>
            <p className="text-sm">You prefer using your body, hands and sense of touch</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          This assessment contains {varkQuestions.length} questions. For each question, 
          select the option that best describes your preference. Your results will help you 
          understand your learning preferences better.
        </p>
      </div>
      
      <button
        onClick={startAssessment}
        className="w-full bg-orange-400 text-white py-2 px-4 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
      >
        Start Assessment
      </button>
    </div>
  );

  const renderQuestionsScreen = () => {
    const question = varkQuestions[currentQuestion];
    
    return (
      <div className="max-w-2xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">Question {currentQuestion + 1} of {varkQuestions.length}</h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
              {Math.round((currentQuestion / varkQuestions.length) * 100)}% Complete
            </span>
          </div>
          
          <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, option.type)}
                  className="w-full text-left p-4 border border-gray-300 rounded-md hover:bg-orange-50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition transform hover:translate-x-1"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResultsScreen = () => {
    const dominantStyle = getDominantStyle();
    const totalQuestions = varkQuestions.length;
    
    const percentages = {
      V: Math.round((results.V / totalQuestions) * 100),
      A: Math.round((results.A / totalQuestions) * 100),
      R: Math.round((results.R / totalQuestions) * 100),
      K: Math.round((results.K / totalQuestions) * 100)
    };
    
    const animationClass = "animate-fade-in";
    
    return (
      <div className="max-w-2xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Learning Style Results</h2>
        
        <div className="mb-8">
          <p className="mb-4 text-gray-600">
            Your dominant learning style is: <span className="font-bold">{dominantStyle === 'V' ? 'Visual' : 
              dominantStyle === 'A' ? 'Aural' : 
              dominantStyle === 'R' ? 'Read/Write' : 
              'Kinesthetic'}</span>
          </p>
          
          <p className="mb-6 text-gray-600">
            {styleDescriptions[dominantStyle]}
          </p>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Your VARK Profile</h3>
            
            <div className="space-y-4">
              <div className={animationClass} style={{ animationDelay: "0.1s" }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-blue-700">Visual</span>
                  <span className="text-sm font-medium text-blue-700">{percentages.V}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentages.V}%` }}></div>
                </div>
              </div>
              
              <div className={animationClass} style={{ animationDelay: "0.2s" }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-green-700">Aural</span>
                  <span className="text-sm font-medium text-green-700">{percentages.A}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentages.A}%` }}></div>
                </div>
              </div>
              
              <div className={animationClass} style={{ animationDelay: "0.3s" }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-purple-700">Read/Write</span>
                  <span className="text-sm font-medium text-purple-700">{percentages.R}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentages.R}%` }}></div>
                </div>
              </div>
              
              <div className={animationClass} style={{ animationDelay: "0.4s" }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-amber-700">Kinesthetic</span>
                  <span className="text-sm font-medium text-amber-700">{percentages.K}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-amber-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentages.K}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="text-lg font-semibold mb-3">Study Recommendations</h3>
            {dominantStyle === 'V' && (
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Use diagrams, charts, and maps when studying</li>
                <li>Highlight important information with different colors</li>
                <li>Watch educational videos and demonstrations</li>
                <li>Create visual mind maps to organize information</li>
              </ul>
            )}
            {dominantStyle === 'A' && (
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Record and listen to lectures</li>
                <li>Discuss topics with others</li>
                <li>Read material aloud to yourself</li>
                <li>Use audiobooks and educational podcasts</li>
              </ul>
            )}
            {dominantStyle === 'R' && (
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Take detailed notes during lectures</li>
                <li>Rewrite information in your own words</li>
                <li>Create lists, headings, and outlines</li>
                <li>Read textbooks and reference materials</li>
              </ul>
            )}
            {dominantStyle === 'K' && (
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Use hands-on exercises and practical applications</li>
                <li>Take frequent breaks during study sessions</li>
                <li>Create models or physical demonstrations</li>
                <li>Use role-playing to understand concepts</li>
              </ul>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => {
              setCurrentStep('intro');
              setCurrentQuestion(0);
              setAnswers([]);
              setResponse([]);
              setResults(null);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Start Over
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            Print Results
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      
      <div className="pt-16">
        {currentStep === 'auth' && renderAuthScreen()}
        {currentStep === 'intro' && renderIntroScreen()}
        {currentStep === 'questions' && renderQuestionsScreen()}
        {currentStep === 'results' && renderResultsScreen()}
      </div>
    </div>
  );
};

export default VARKAssessment;