import { useState, useEffect, use } from 'react';
import { createStudent } from '../api/student';
import varkQuestionsEN from '../test_data/varkQuestions';
import varkQuestionsMR from '../test_data/questionsMR';
import { generateInsights, generateInsightsMR } from '../api/ai';
import { verify } from '../api/login';
import ReactMarkdown from 'react-markdown';

const VARKAssessment = ({ language }) => {
  const [currentStep, setCurrentStep] = useState('auth'); // 'auth', 'intro', 'questions', 'results'
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [response, setResponse] = useState([]);
  const [name, setName] = useState('');
  const [Id, setId] = useState('');
  const [insights, setInsights] = useState('No Insights generated yet.');
  const [insightsMR, setInsightsMR] = useState('No Insights generated yet.');
  const [avialable, setAvailable] = useState(false);


  const varkQuestions = (language === 'en' ? varkQuestionsEN : varkQuestionsMR);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if(name.trim() === '') {
      setAuthError('Please Enter Your Name');
      return;
    }
    if(Id.trim() === '') {
      setAuthError('Please Enter Your Roll Number');
      return;
    }
    if (authCode.trim() === '') {
      setAuthError('Please enter an authentication code');
      return;
    }
    
    const res = await verify(authCode);
    if (!res.success) {
      setAuthError(res.message);
      return;
    }
    setCurrentStep('intro');
  };

  const startAssessment = () => {
    setCurrentStep('questions');
  };

  const totalQuestions = varkQuestions.length;

  useEffect(() => {
    const interact = async () => {
      if(currentStep === 'results') {
        const dominantStyle = getDominantStyle();
        const data = await createStudent({
          name: name,
          auth: authCode,
          Id: Id,
          testData: response,
          testResult: {
            scores: results,
            dominantStyle: dominantStyle,
            styleDescriptions: styleDescriptions[dominantStyle],
            percentages: {
              V: Number(((results.V / totalQuestions) * 100).toFixed(2)),
              A: Number(((results.A / totalQuestions) * 100).toFixed(2)),
              R: Number(((results.R / totalQuestions) * 100).toFixed(2)),
              K: Number(((results.K / totalQuestions) * 100).toFixed(2))
            },
            studyRecommendations: studyRecommendations[dominantStyle],
          },
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
      answer: varkQuestions[questionIndex].options.find(option => option.type === answerType)?.text,
      type: answerType
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

  const getInsights = async () => {
    try {
      const totalQuestions = varkQuestions.length;
      let V = Number(((results.V / totalQuestions) * 100).toFixed(2));
      let A = Number(((results.A / totalQuestions) * 100).toFixed(2));
      let R = Number(((results.R / totalQuestions) * 100).toFixed(2));
      let K =  Number(((results.K / totalQuestions) * 100).toFixed(2));
      const data = await generateInsights(V,A,R,K);
      setInsights(data);
      const dataMR = await generateInsightsMR(V,A,R,K);
      setInsightsMR(dataMR);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights("Error generating insights. Please try again later.");
    }
  };

  useEffect(() => {
    const get = async () => {
        if (currentStep === 'results' && !avialable) {
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

  const styleDescriptionsEN = {
    V: "Visual learners prefer to see information presented in visual formats such as charts, graphs, maps, diagrams, and demonstrations.",
    A: "Aural learners learn best by listening and speaking. They benefit from lectures, discussions, and talking things through.",
    R: "Read/Write learners prefer information displayed as words. They learn best from reading texts and writing notes.",
    K: "Kinesthetic learners learn through experience and practice. They prefer hands-on activities and learn by doing."
  };

  const studyRecommendationsEN = {
    V: [
      "Use diagrams, charts, and maps when studying",
      "Highlight important information with different colors",
      "Watch educational videos and demonstrations",
      "Create visual mind maps to organize information"
    ],
    A: [
      "Record and listen to lectures",
      "Discuss topics with others",
      "Read material aloud to yourself",
      "Use audiobooks and educational podcasts"
    ],
    R: [
      "Take detailed notes during lectures",
      "Rewrite information in your own words",
      "Create lists, headings, and outlines",
      "Read textbooks and reference materials"
    ],
    K: [
      "Use hands-on exercises and practical applications",
      "Take frequent breaks during study sessions",
      "Create models or physical demonstrations",
      "Use role-playing to understand concepts"
    ]
  };

  const styleDescriptionsMR = {
    V: "दृश्य शिक्षणार्थींना माहिती तक्ते, आलेख, नकाशे, आकृत्या आणि प्रात्यक्षिके यांसारख्या दृश्य स्वरूपात प्रस्तुत केलेली दिसायला आवडते.",
    A: "श्रवण शिक्षणार्थी ऐकून आणि बोलून सर्वोत्तम शिकतात. त्यांना व्याख्याने, चर्चा आणि गोष्टींवर बोलून फायदा होतो.",
    R: "वाचन/लेखन शिक्षणार्थींना शब्दांमध्ये दर्शविलेली माहिती आवडते. ते लेख वाचून आणि नोट्स लिहून सर्वोत्तम शिकतात.",
    K: "क्रियाशील शिक्षणार्थी अनुभव आणि सराव यातून शिकतात. त्यांना प्रत्यक्ष हाताळून करण्याच्या क्रियाकलापांना प्राधान्य देतात आणि करून शिकतात."
  };

  const studyRecommendationsMR = {
    V: [
      "अभ्यास करताना आकृत्या, तक्ते आणि नकाशे वापरा",
      "वेगवेगळ्या रंगांनी महत्त्वाची माहिती हायलाइट करा",
      "शैक्षणिक व्हिडिओ आणि प्रात्यक्षिके पहा",
      "माहिती व्यवस्थित करण्यासाठी दृश्य माइंड मॅप्स तयार करा"
      ],
      A: [
      "व्याख्याने रेकॉर्ड करा आणि ऐका",
      "इतरांसोबत विषयांवर चर्चा करा",
      "स्वतःला मोठ्याने वाचा",
      "ऑडिओबुक्स आणि शैक्षणिक पॉडकास्ट वापरा"
      ],
      R: [
      "व्याख्यानांदरम्यान तपशीलवार नोट्स घ्या",
      "माहिती तुमच्या स्वतःच्या शब्दांत पुन्हा लिहा",
      "याद्या, शीर्षके आणि रूपरेषा तयार करा",
      "पाठ्यपुस्तके आणि संदर्भ सामग्री वाचा"
      ],
      K: [
      "हातांनी करून शिकण्याचे व्यायाम आणि व्यावहारिक उपयोग वापरा",
      "अभ्यास सत्रांदरम्यान वारंवार ब्रेक घ्या",
      "मॉडेल्स किंवा प्रत्यक्ष प्रात्यक्षिके तयार करा",
      "संकल्पना समजून घेण्यासाठी रोल-प्लेइंग वापरा"
      ]
  };

  const styleDescriptions = language === 'en' ? styleDescriptionsEN : styleDescriptionsMR;
  const studyRecommendations = language === 'en' ? studyRecommendationsEN : studyRecommendationsMR;
  
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-100 to-orange-50 p-4">
      <div className="w-full max-w-xl p-4 sm:p-8 bg-white rounded-lg shadow-xl relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center mt-4">VARK Learning Style</h2>
        <p className="text-center text-gray-500 mb-6 sm:mb-8">Discover your optimal way of learning</p>
        
        <form onSubmit={handleAuthSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="rno" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
            <input
              type="number"
              id="rno"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-colors"
              value={Id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter your roll number"
            />
          </div>
          
          <div>
            <label htmlFor="authCode" className="block text-sm font-medium text-gray-700 mb-1">Class Code</label>
            <input
              type="text"
              id="authCode"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-colors"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="Enter your class code"
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
            className="w-full bg-orange-500 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-colors font-medium"
          >
            Start Assessment
          </button>
        </form>
      </div>
    </div>
  );
  
  const renderIntroScreen = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-100 to-orange-50 p-4">
      <div className="w-full max-w-3xl p-4 sm:p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">VARK Learning Style Assessment</h2>
        
        <div className="mb-6 sm:mb-8">
          <p className="mb-4 sm:mb-6 text-base sm:text-lg text-gray-600 text-center">
            The VARK model helps identify your preferred learning style:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-100 shadow-sm transform hover:scale-105 transition-transform">
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">V</span>
                <h3 className="font-bold text-blue-800">Visual</h3>
              </div>
              <p className="text-blue-700 text-sm sm:text-base">You prefer using images, pictures, and spatial understanding</p>
            </div>
            
            <div className="p-4 sm:p-6 bg-green-50 rounded-lg border border-green-100 shadow-sm transform hover:scale-105 transition-transform">
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="bg-green-100 text-green-800 p-2 rounded-full mr-3">A</span>
                <h3 className="font-bold text-green-800">Aural</h3>
              </div>
              <p className="text-green-700 text-sm sm:text-base">You prefer using sound and music</p>
            </div>
            
            <div className="p-4 sm:p-6 bg-purple-50 rounded-lg border border-purple-100 shadow-sm transform hover:scale-105 transition-transform">
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="bg-purple-100 text-purple-800 p-2 rounded-full mr-3">R</span>
                <h3 className="font-bold text-purple-800">Read/Write</h3>
              </div>
              <p className="text-purple-700 text-sm sm:text-base">You prefer using words, reading and writing</p>
            </div>
            
            <div className="p-4 sm:p-6 bg-amber-50 rounded-lg border border-amber-100 shadow-sm transform hover:scale-105 transition-transform">
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="bg-amber-100 text-amber-800 p-2 rounded-full mr-3">K</span>
                <h3 className="font-bold text-amber-800">Kinesthetic</h3>
              </div>
              <p className="text-amber-700 text-sm sm:text-base">You prefer using your body, hands and sense of touch</p>
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
              This assessment contains {varkQuestions.length} questions. For each question, 
              select the option that best describes your preference. Your results will help you 
              understand your learning preferences better and provide strategies tailored to your style.
            </p>
          </div>
        </div>
        
        <button
          onClick={startAssessment}
          className="w-full bg-orange-500 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-colors font-medium flex items-center justify-center"
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
    const question = varkQuestions[currentQuestion];
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-100 to-orange-50 p-4">
        <div className="w-full max-w-3xl p-4 sm:p-8 bg-white rounded-lg shadow-xl">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <span className="px-3 sm:px-4 py-1 sm:py-2 bg-orange-100 text-orange-800 font-medium rounded-full text-sm sm:text-base">
                Question {currentQuestion + 1} of {varkQuestions.length}
              </span>
              <div className="flex items-center">
                <div className="w-full sm:w-56 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                       style={{ width: `${(currentQuestion / varkQuestions.length) * 100}%` }}></div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-500">
                  {Math.round((currentQuestion / varkQuestions.length) * 100)}%
                </span>
              </div>
            </div>
            
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              <h2 className="text-base sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                {question.question}
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, option.type)}
                    className="w-full text-left p-3 sm:p-5 border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition transform hover:translate-x-2 flex items-center text-sm sm:text-base"
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
    const dominantStyle = getDominantStyle();
    const totalQuestions = varkQuestions.length;
    
    const percentages = {
      V: Number(((results.V / totalQuestions) * 100).toFixed(2)),
      A: Number(((results.A / totalQuestions) * 100).toFixed(2)),
      R: Number(((results.R / totalQuestions) * 100).toFixed(2)),
      K: Number(((results.K / totalQuestions) * 100).toFixed(2))
    };

    
    const styleColors = {
      V: { bg: 'bg-blue-600', text: 'text-blue-700', light: 'bg-blue-50' },
      A: { bg: 'bg-green-600', text: 'text-green-700', light: 'bg-green-50' },
      R: { bg: 'bg-purple-600', text: 'text-purple-700', light: 'bg-purple-50' },
      K: { bg: 'bg-amber-600', text: 'text-amber-700', light: 'bg-amber-50' }
    };
    
    const dominantStyleName = 
      dominantStyle === 'V' ? 'Visual' : 
      dominantStyle === 'A' ? 'Aural' : 
      dominantStyle === 'R' ? 'Read/Write' : 
      'Kinesthetic';
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-100 to-orange-50 py-4 px-4">
        <div className="w-full max-w-4xl p-4 sm:p-8 bg-white rounded-lg shadow-xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full ${styleColors[dominantStyle].light} mb-3 sm:mb-4`}>
              <span className={`text-xl sm:text-2xl font-bold ${styleColors[dominantStyle].text}`}>{dominantStyle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Your Learning Style Results</h2>
            <p className={`text-base sm:text-lg ${styleColors[dominantStyle].text} font-medium`}>
              Your dominant learning style is {dominantStyleName}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 border-b pb-2">Your VARK Profile</h3>
                
                <div className="space-y-4 sm:space-y-5">
                  <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-blue-700 text-sm sm:text-base">Visual</span>
                      <span className="font-medium text-blue-700 text-sm sm:text-base">{percentages.V}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-blue-600 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out" 
                           style={{ width: `${percentages.V}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-green-700 text-sm sm:text-base">Aural</span>
                      <span className="font-medium text-green-700 text-sm sm:text-base">{percentages.A}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-green-600 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out" 
                           style={{ width: `${percentages.A}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-purple-700 text-sm sm:text-base">Read/Write</span>
                      <span className="font-medium text-purple-700 text-sm sm:text-base">{percentages.R}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-purple-600 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out" 
                           style={{ width: `${percentages.R}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-amber-700 text-sm sm:text-base">Kinesthetic</span>
                      <span className="font-medium text-amber-700 text-sm sm:text-base">{percentages.K}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div className="bg-amber-600 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out" 
                           style={{ width: `${percentages.K}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 sm:p-6 ${styleColors[dominantStyle].light} rounded-lg border`}>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">About Your Learning Style</h3>
                <p className="text-gray-700 text-sm sm:text-base">{styleDescriptions[dominantStyle]}</p>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                </svg>
                Study Recommendations
              </h3>
              
              <ul className="space-y-2 sm:space-y-3">
                {studyRecommendations[dominantStyle]?.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-gray-700 text-sm sm:text-base">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              Additional Learning Insights
            </h3>
            <div className="text-gray-700 text-sm sm:text-base space-y-2 sm:space-y-3">
              <ReactMarkdown>{(language === "en")? insights: insightsMR}</ReactMarkdown>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                setCurrentStep('intro');
                setCurrentQuestion(0);
                setAnswers([]);
                setResponse([]);
                setResults(null);
                setAvailable(false);
              }}
              className="flex-1 px-4 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Start Over
            </button>
            
            <button
              onClick={printResults}
              className="flex-1 px-4 py-2 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Print Results
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen pt-15 bg-gray-50">
<style>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
  }

  @media print {
    /* Hide the navbar during printing */
    nav, header, .navbar, [role="navigation"] {
      display: none !important;
    }
    
    /* Reset the padding that accounts for navbar */
    body {
      padding-top: 0 !important;
      margin-top: 0 !important;
      background: white !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    /* Reset positioning that might be accounting for navbar */
    .min-h-screen, .pt-15 {
      padding-top: 0 !important;
      min-height: auto !important;
    }
    
    /* Remove background gradient */
    .bg-gradient-to-r {
      background: white !important;
    }
    
    /* Hide buttons and other non-printable elements */
    button, .no-print {
      display: none !important;
    }
    
    /* Remove shadows and simplify borders for better printing */
    .shadow-xl, .border {
      box-shadow: none !important;
      border-color: #eee !important;
    }
    
    /* Adjust padding for print */
    .py-4, .px-4, .p-4, .sm\\:p-8 {
      padding: 0.5rem !important;
    }
    
    /* Ensure content uses full width */
    .w-full.max-w-4xl {
      max-width: 100% !important;
      margin: 0 auto !important;
      padding: 0 !important;
    }
    
    /* Ensure progress bars and colored elements print correctly */
    .bg-blue-600, .bg-green-600, .bg-purple-600, .bg-amber-600 {
      print-color-adjust: exact !important;
      -webkit-print-color-adjust: exact !important;
    }
    
    /* Prevent awkward page breaks */
    .grid, .p-6, .space-y-4, .mb-6 {
      page-break-inside: avoid;
    }
    
    /* Hide the button container completely */
    .flex.flex-col.sm\\:flex-row.justify-between {
      display: none !important;
    }
    
    /* Force background colors to print */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`}</style>
      
      {currentStep === 'auth' && renderAuthScreen()}
      {currentStep === 'intro' && renderIntroScreen()}
      {currentStep === 'questions' && renderQuestionsScreen()}
      {currentStep === 'results' && renderResultsScreen()}
    </div>
  );
};

export default VARKAssessment;