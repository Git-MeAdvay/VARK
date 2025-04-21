import { useState, useEffect } from 'react';
import { generateInsights } from '../api/ai';
import ReactMarkdown from 'react-markdown';

const ILSAssessment = ({ language = 'en' }) => {
  const [currentStep, setCurrentStep] = useState('intro'); // 'auth', 'intro', 'questions', 'results'
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [department, setDepartment] = useState('');
  const [insights, setInsights] = useState('No insights generated yet.');
  const [available, setAvailable] = useState(false);


  const ilsQuestions = [
    {
      question: "I understand something better after I",
      options: [
        { text: "try it out", type: "ACT" },
        { text: "think it through", type: "REF" }
      ]
    },
    {
      question: "When I am learning something new, it helps me to",
      options: [
        { text: "talk about it", type: "ACT" },
        { text: "think about it", type: "REF" }
      ]
    },
    {
      question: "I prefer courses that emphasize",
      options: [
        { text: "concrete material (facts, data)", type: "SEN" },
        { text: "abstract material (concepts, theories)", type: "INT" }
      ]
    },
    {
      question: "I find it easier to",
      options: [
        { text: "learn facts", type: "SEN" },
        { text: "learn concepts", type: "INT" }
      ]
    },
    {
      question: "When I think about what I did yesterday, I am most likely to get",
      options: [
        { text: "a picture", type: "VIS" },
        { text: "words", type: "VRB" }
      ]
    },
    {
      question: "I prefer to get new information in",
      options: [
        { text: "pictures, diagrams, graphs, or maps", type: "VIS" },
        { text: "written directions or verbal information", type: "VRB" }
      ]
    },
    {
      question: "I tend to",
      options: [
        { text: "understand details of a subject but may be fuzzy about its overall structure", type: "SEQ" },
        { text: "understand the overall structure but may be fuzzy about details", type: "GLO" }
      ]
    },
    {
      question: "When solving problems I",
      options: [
        { text: "work my way to the solutions one step at a time", type: "SEQ" },
        { text: "often just see the solutions but then have to struggle to figure out the steps", type: "GLO" }
      ]
    },
    {
      question: "When solving problems I",
      options: [
        { text: "work my way to the solutions one step at a time", type: "SEQ" },
        { text: "often just see the solutions but then have to struggle to figure out the steps", type: "GLO" }
      ]
    },
    {
      question: "When solving problems I",
      options: [
        { text: "work my way to the solutions one step at a time", type: "SEQ" },
        { text: "often just see the solutions but then have to struggle to figure out the steps", type: "GLO" }
      ]
    },
    {
      question: "When solving problems I",
      options: [
        { text: "work my way to the solutions one step at a time", type: "SEQ" },
        { text: "often just see the solutions but then have to struggle to figure out the steps", type: "GLO" }
      ]
    }
  ];

  const totalQuestions = ilsQuestions.length;

  const handleAuthSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === '') {
      setAuthError('Please Enter Your Name');
      return;
    }
    if (schoolName.trim() === '') {
      setAuthError('Please Enter Your School Name');
      return;
    }
    if (authCode.trim() === '') {
      setAuthError('Please enter an authentication code');
      return;
    }
    setCurrentStep('intro');
  };

  const startAssessment = () => {
    setCurrentStep('questions');
  };

  const handleAnswerSelect = (questionIndex, answerType) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerType;
    setAnswers(newAnswers);
    
    setIsAnimating(true);
    
    setTimeout(() => {
      if (currentQuestion < ilsQuestions.length - 1) {
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

  const getInsights = async () => {
    try {
      const actPercent = (results.ACT / (results.ACT + results.REF)) * 100;
      const senPercent = (results.SEN / (results.SEN + results.INT)) * 100;
      const visPercent = (results.VIS / (results.VIS + results.VRB)) * 100;
      const seqPercent = (results.SEQ / (results.SEQ + results.GLO)) * 100;
      
      const data = await generateInsights(actPercent, senPercent, visPercent, seqPercent);
      setInsights(data);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights("Error generating insights. Please try again later.");
    }
  };

  useEffect(() => {
    const get = async () => {
      if (currentStep === 'results' && !available) {
        await getInsights();
        setAvailable(true);
      }
    };
    get();
  }, [currentStep]);

  const printResults = () => {
    try {
      const scrollPos = window.scrollY;
      
      document.body.classList.add('printing');
      
      window.scrollTo(0, 0);
      
      setTimeout(() => {
        window.print();
        
        setTimeout(() => {
          document.body.classList.remove('printing');
          
          window.scrollTo(0, scrollPos);
        }, 100);
      }, 100);
    } catch (err) {
      console.error("Print error:", err);
      window.print();
    }
  };

  const calculateResults = (finalAnswers) => {
    const scores = {
      ACT: 0, // Active
      REF: 0, // Reflective
      SEN: 0, // Sensing
      INT: 0, // Intuitive
      VIS: 0, // Visual
      VRB: 0, // Verbal
      SEQ: 0, // Sequential
      GLO: 0  // Global
    };
    
    finalAnswers.forEach(answer => {
      if (answer) {
        scores[answer]++;
      }
    });
    
    setResults(scores);
    setCurrentStep('results');
  };

  const getDimensionScore = (dimension1, dimension2) => {
    if (!results) return 0;
    
    const score1 = results[dimension1] || 0;
    const score2 = results[dimension2] || 0;
    
    const total = score1 + score2;
    if (total === 0) return 0;
    
    const balance = score1 - score2;
    
    const maxPossible = total;
    return Math.round((balance / maxPossible) * 5);
  };

  const getPreference = (score) => {
    const absScore = Math.abs(score);
    if (absScore <= 1) return "Balanced";
    if (absScore <= 3) return "Moderate";
    return "Strong";
  };

  const dimensionDescriptions = {
    ACT: "Active learners tend to retain and understand information best by doing something active with it—discussing or applying it or explaining it to others.",
    REF: "Reflective learners prefer to think about it quietly first. They prefer to work alone.",
    SEN: "Sensing learners tend to like learning facts, solve problems with well-established methods, and dislike complications.",
    INT: "Intuitive learners often prefer discovering possibilities and relationships. They like innovation and dislike repetition.",
    VIS: "Visual learners remember best what they see—pictures, diagrams, flowcharts, time lines, films, demonstrations.",
    VRB: "Verbal learners get more out of words—written and spoken explanations.",
    SEQ: "Sequential learners tend to gain understanding in linear steps, with each step following logically from the previous one.",
    GLO: "Global learners tend to learn in large jumps, absorbing material almost randomly without seeing connections, and then suddenly 'getting it.'"
  };

  const teachingRecommendations = {
    ACT: [
      "Incorporate group activities and discussions",
      "Include problem-solving exercises in class",
      "Design activities where students can explain concepts to others",
      "Use role-playing and simulations"
    ],
    REF: [
      "Provide time for individual reflection during class",
      "Ask students to write short summaries or reflections",
      "Give advance notice of topics so students can prepare",
      "Allow time for students to formulate answers before discussions"
    ],
    SEN: [
      "Connect theory to real-world examples and applications",
      "Provide step-by-step procedures and methods",
      "Include hands-on activities and laboratory work",
      "Present concrete facts and data before concepts"
    ],
    INT: [
      "Present the big picture and underlying principles first",
      "Challenge students with open-ended problems",
      "Encourage creative thinking and novel approaches",
      "Highlight patterns and connections between topics"
    ],
    VIS: [
      "Use diagrams, charts, and visual models in teaching",
      "Incorporate videos and demonstrations",
      "Encourage students to create visual representations",
      "Use color-coding and spatial organization"
    ],
    VRB: [
      "Provide written materials and lecture notes",
      "Encourage discussions and verbal explanations",
      "Use storytelling and narratives to explain concepts",
      "Have students write summaries in their own words"
    ],
    SEQ: [
      "Present material in a logical, step-by-step progression",
      "Clearly outline lesson objectives and structure",
      "Break complex topics into smaller, manageable parts",
      "Show connections between current material and previous lessons"
    ],
    GLO: [
      "Start with the big picture before details",
      "Connect new material to familiar concepts",
      "Use analogies and metaphors to illustrate relationships",
      "Allow creative problem-solving approaches"
    ]
  };

  const renderAuthScreen = () => (
    <div className="flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 p-4" style={{ minHeight: 'calc(100vh - 15px)', paddingTop: '15px' }}>
      <div className="w-full max-w-xl p-4 sm:p-8 bg-white rounded-lg shadow-xl relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center mt-4">Index of Learning Styles</h2>
        <p className="text-center text-gray-500 mb-6 sm:mb-8">Discover your teaching preferences</p>
        
        <form onSubmit={handleAuthSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
            <input
              type="text"
              id="school"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Enter your school name"
            />
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              id="department"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter your department (optional)"
            />
          </div>
          
          <div>
            <label htmlFor="authCode" className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
            <input
              type="text"
              id="authCode"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="Enter your access code"
            />
          </div>
          
          {authError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <span>{authError}</span>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors font-medium"
          >
            Start Assessment
          </button>
        </form>
      </div>
    </div>
  );
  
  const renderIntroScreen = () => (
    <div className="flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 p-4 min-h-screen pt-20">
      <div className="w-full max-w-3xl p-4 sm:p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Index of Learning Styles Assessment</h2>
        
        <div className="mb-6 sm:mb-8">
          <p className="mb-4 sm:mb-6 text-base sm:text-lg text-gray-600 text-center">
            The ILS model helps identify your teaching and learning preferences across four dimensions:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 bg-indigo-50 rounded-lg border border-indigo-100 shadow-sm transform hover:scale-105 transition-transform">
              <div className="flex items-center mb-2 sm:mb-3">
                <h3 className="font-bold text-indigo-800">Active vs. Reflective</h3>
              </div>
              <p className="text-indigo-700 text-sm sm:text-base">How you process information: through engagement and practice or through introspection and thinking</p>
            </div>
            
            <div className="p-4 sm:p-6 bg-teal-50 rounded-lg border border-teal-100 shadow-sm transform hover:scale-105 transition-transform">
              <div className="flex items-center mb-2 sm:mb-3">
                <h3 className="font-bold text-teal-800">Sensing vs. Intuitive</h3>
              </div>
              <p className="text-teal-700 text-sm sm:text-base">How you perceive information: through concrete, practical facts or through abstract concepts and theories</p>
            </div>
            
            <div className="p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-100 shadow-sm transform hover:scale-105 transition-transform">
              <div className="flex items-center mb-2 sm:mb-3">
                <h3 className="font-bold text-blue-800">Visual vs. Verbal</h3>
              </div>
              <p className="text-blue-700 text-sm sm:text-base">How you receive information: through visual representations or through words and text</p>
            </div>
            
            <div className="p-4 sm:p-6 bg-violet-50 rounded-lg border border-violet-100 shadow-sm transform hover:scale-105 transition-transform">
              <div className="flex items-center mb-2 sm:mb-3">
                <h3 className="font-bold text-violet-800">Sequential vs. Global</h3>
              </div>
              <p className="text-violet-700 text-sm sm:text-base">How you understand information: in sequential, linear steps or in large, holistic leaps</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 mb-6 sm:mb-8">
            <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              About This Assessment
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              This assessment contains {ilsQuestions.length} questions. For each question, 
              select the option that best describes your preference. Your results will help you 
              understand your teaching style better and provide strategies tailored to your preferences.
              There are no right or wrong answers - only different approaches to teaching and learning.
            </p>
          </div>
        </div>
        
        <button
          onClick={startAssessment}
          className="w-full bg-blue-500 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors font-medium flex items-center justify-center"
        >
          <span>Start Assessment</span>
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  );
  
  const renderQuestionsScreen = () => {
    const question = ilsQuestions[currentQuestion];
    
    return (
      <div className="flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 p-4 min-h-screen pt-20">
        <div className="w-full max-w-3xl p-4 sm:p-8 bg-white rounded-lg shadow-xl">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <span className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-100 text-blue-800 font-medium rounded-full text-sm sm:text-base">
                Question {currentQuestion + 1} of {ilsQuestions.length}
              </span>
              <div className="flex items-center">
                <div className="w-full sm:w-56 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                       style={{ width: `${(currentQuestion / ilsQuestions.length) * 100}%` }}></div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-500">
                  {Math.round((currentQuestion / ilsQuestions.length) * 100)}%
                </span>
              </div>
            </div>
            
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              <h2 className="text-base sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                {question.question}
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, option.type)}
                    className="w-full text-left p-3 sm:p-5 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition transform hover:translate-x-2 flex items-center text-sm sm:text-base"
                  >
                    <span className="bg-gray-100 text-gray-700 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full mr-2 sm:mr-3 font-medium text-xs sm:text-sm flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderResultsScreen = () => {
    // Fix 1: Properly calculate scores for each dimension
    const calculateDimensionScore = (dim1, dim2) => {
      if (!results) return 0;
      
      const score1 = results[dim1] || 0;
      const score2 = results[dim2] || 0;
      
      if (score1 + score2 === 0) return 0;
      
      // Calculate score on a scale from -5 to 5
      // Positive means preference for dim1, negative means preference for dim2
      return Math.round(((score1 - score2) / (score1 + score2)) * 5);
    };
  
    // Calculate scores correctly
    const actRefScore = calculateDimensionScore('ACT', 'REF');
    const senIntScore = calculateDimensionScore('SEN', 'INT');
    const visVrbScore = calculateDimensionScore('VIS', 'VRB');
    const seqGloScore = calculateDimensionScore('SEQ', 'GLO');
  
    // Fix 2: Determine dominant preference correctly
    const actRefDominant = actRefScore >= 0 ? 'ACT' : 'REF';
    const senIntDominant = senIntScore >= 0 ? 'SEN' : 'INT';
    const visVrbDominant = visVrbScore >= 0 ? 'VIS' : 'VRB';
    const seqGloDominant = seqGloScore >= 0 ? 'SEQ' : 'GLO';
    
    const dimensionColors = {
      ACT: { bg: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
      REF: { bg: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
      SEN: { bg: 'bg-teal-600', light: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
      INT: { bg: 'bg-teal-600', light: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
      VIS: { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      VRB: { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      SEQ: { bg: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
      GLO: { bg: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' }
    };
  
    const dimensionNames = {
      ACT: "Active",
      REF: "Reflective",
      SEN: "Sensing",
      INT: "Intuitive",
      VIS: "Visual",
      VRB: "Verbal",
      SEQ: "Sequential",
      GLO: "Global"
    };
    
    const renderScale = (score, leftType, rightType) => {
        const absScore = Math.abs(score);
        const leftSide = score < 0;
        const leftColor = dimensionColors[leftType].bg;
        const rightColor = dimensionColors[rightType].bg;
        
        const getIntensityLabel = (score) => {
          const abs = Math.abs(score);
          if (abs <= 1) return "Balanced";
          if (abs <= 3) return "Moderate";
          return "Strong";
        };
        
        return (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${leftColor} mr-2`}></div>
                <span className={`font-medium ${leftSide ? 'text-gray-800' : 'text-gray-500'}`}>
                  {dimensionNames[leftType]}
                </span>
                {leftSide && <span className="ml-2 text-sm bg-gray-100 px-2 py-0.5 rounded">{getIntensityLabel(score)}</span>}
              </div>
              <div className="flex items-center">
                {!leftSide && <span className="mr-2 text-sm bg-gray-100 px-2 py-0.5 rounded">{getIntensityLabel(score)}</span>}
                <span className={`font-medium ${!leftSide ? 'text-gray-800' : 'text-gray-500'}`}>
                  {dimensionNames[rightType]}
                </span>
                <div className={`w-3 h-3 rounded-full ${rightColor} ml-2`}></div>
              </div>
            </div>
            
            {/* Use a grid layout with the center marker positioned absolutely */}
            <div className="h-8 rounded-lg overflow-hidden bg-gray-200 relative">
              {/* Split the scale into two 50% sections */}
              <div className="flex h-full">
                {/* Left half of the scale */}
                <div className="w-1/2 flex justify-end relative">
                  {/* Filled bar that grows from center to left */}
                  {leftSide && (
                    <div 
                      className={`${leftColor} h-full transition-all duration-1000 flex justify-end items-center`} 
                      style={{ width: `${(absScore / 5) * 100}%` }}
                    >
                      {absScore >= 1 && (
                        <span className="text-white text-xs font-bold px-2 z-20">{absScore}</span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Right half of the scale */}
                <div className="w-1/2 relative">
                  {/* Filled bar that grows from center to right */}
                  {!leftSide && (
                    <div 
                      className={`${rightColor} h-full transition-all duration-1000 flex items-center`} 
                      style={{ width: `${(absScore / 5) * 100}%` }}
                    >
                      {absScore >= 1 && (
                        <span className="text-white text-xs font-bold px-2 z-20">{absScore}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Center marker positioned absolutely in the middle */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-600 h-full z-10"></div>
            </div>
            
            {/* Tick marks */}
            <div className="flex justify-between px-0 mt-1 text-xs text-gray-500">
              <span>5</span>
              <span>3</span>
              <span>1</span>
              <span>0</span>
              <span>1</span>
              <span>3</span>
              <span>5</span>
            </div>
          </div>
        );
      };
    
    return (
      <div className="flex items-center justify-center min-h-screen pt-30 pb-8 bg-gradient-to-r from-blue-100 to-blue-50 px-4">
        <div className="w-full max-w-4xl p-4 sm:p-8 bg-white rounded-lg shadow-xl">
          {/* Header with user info */}
          <div className="text-center mb-6 sm:mb-8 relative pb-6 border-b border-gray-200">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h2 className="text-2xl pt-4 sm:text-3xl font-bold text-gray-800 mb-2 mt-4">Your Teaching Style Profile</h2>
            <p className="text-base sm:text-lg text-gray-600">
              {name && `${name}${schoolName ? ` - ${schoolName}` : ''}${department ? ` (${department})` : ''}`}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Understanding your preferences can help improve your teaching effectiveness
            </p>
          </div>
          
          {/* Main content */}
          <div className="mb-8 sm:mb-10 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              Dimension Scales
            </h3>
            <p className="text-gray-600 mb-6">
              Your position on each scale indicates your preference strength. Values near the center (0) 
              indicate a balanced style, while values toward either end indicate stronger preferences.
            </p>
            
            <div className="space-y-6 mb-4 sm:mb-6">
              {renderScale(actRefScore, 'REF', 'ACT')}
              {renderScale(senIntScore, 'INT', 'SEN')}
              {renderScale(visVrbScore, 'VRB', 'VIS')}
              {renderScale(seqGloScore, 'GLO', 'SEQ')}
            </div>
            
            <div className="text-sm text-gray-600 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2zm0 0v-2"></path>
                </svg>
                These results reflect your general preferences based on {totalQuestions} questions. Your actual teaching style may vary depending on context and subject matter.
              </p>
            </div>
          </div>
          
          {/* Two column layout for preferences and recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 print:grid-cols-2">
            <div className="col-span-1">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
                Your Dominant Preferences
              </h3>
              
              <div className="space-y-4">
                {/* Active/Reflective */}
                <div className={`p-4 rounded-lg ${dimensionColors[actRefDominant].light} border ${dimensionColors[actRefDominant].border} hover:shadow-md transition-shadow transform hover:scale-[1.01]`}>
                  <h4 className={`font-bold ${dimensionColors[actRefDominant].text} text-lg mb-2`}>
                    {dimensionNames[actRefDominant]} ({getPreference(actRefScore)})
                  </h4>
                  <p className="text-gray-600">{dimensionDescriptions[actRefDominant]}</p>
                </div>
                
                {/* Sensing/Intuitive */}
                <div className={`p-4 rounded-lg ${dimensionColors[senIntDominant].light} border ${dimensionColors[senIntDominant].border} hover:shadow-md transition-shadow transform hover:scale-[1.01]`}>
                  <h4 className={`font-bold ${dimensionColors[senIntDominant].text} text-lg mb-2`}>
                    {dimensionNames[senIntDominant]} ({getPreference(senIntScore)})
                  </h4>
                  <p className="text-gray-600">{dimensionDescriptions[senIntDominant]}</p>
                </div>
                
                {/* Visual/Verbal */}
                <div className={`p-4 rounded-lg ${dimensionColors[visVrbDominant].light} border ${dimensionColors[visVrbDominant].border} hover:shadow-md transition-shadow transform hover:scale-[1.01]`}>
                  <h4 className={`font-bold ${dimensionColors[visVrbDominant].text} text-lg mb-2`}>
                    {dimensionNames[visVrbDominant]} ({getPreference(visVrbScore)})
                  </h4>
                  <p className="text-gray-600">{dimensionDescriptions[visVrbDominant]}</p>
                </div>
                
                {/* Sequential/Global */}
                <div className={`p-4 rounded-lg ${dimensionColors[seqGloDominant].light} border ${dimensionColors[seqGloDominant].border} hover:shadow-md transition-shadow transform hover:scale-[1.01]`}>
                  <h4 className={`font-bold ${dimensionColors[seqGloDominant].text} text-lg mb-2`}>
                    {dimensionNames[seqGloDominant]} ({getPreference(seqGloScore)})
                  </h4>
                  <p className="text-gray-600">{dimensionDescriptions[seqGloDominant]}</p>
                </div>
              </div>
            </div>
            
            <div className="col-span-1">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Teaching Recommendations
              </h3>
              
              <div className="mb-6 space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-indigo-500 mr-2"></div>
                    Based on your {dimensionNames[actRefDominant]} preference:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {teachingRecommendations[actRefDominant].map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-teal-500 mr-2"></div>
                    Based on your {dimensionNames[senIntDominant]} preference:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {teachingRecommendations[senIntDominant].map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    Based on your {dimensionNames[visVrbDominant]} preference:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {teachingRecommendations[visVrbDominant].map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-violet-500 mr-2"></div>
                    Based on your {dimensionNames[seqGloDominant]} preference:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {teachingRecommendations[seqGloDominant].map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Insights section with improved styling */}
          {available && (
            <div className="mb-8 sm:mb-10 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-blue-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"></path>
                </svg>
                AI-Generated Teaching Insights
              </h3>
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                    <ReactMarkdown>{insights}</ReactMarkdown>
                </p>
              </div>
            </div>
          )}
          
          {/* Action buttons with improved styling */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={printResults}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Print Results
            </button>
            
            <button
              onClick={() => setCurrentStep('intro')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors flex items-center border border-gray-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
              </svg>
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      {currentStep === 'auth' && renderAuthScreen()}
      {currentStep === 'intro' && renderIntroScreen()}
      {currentStep === 'questions' && renderQuestionsScreen()}
      {currentStep === 'results' && renderResultsScreen()}
    </>
  );
}

export default ILSAssessment;