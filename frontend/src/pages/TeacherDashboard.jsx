import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchStudents } from '../api/fetch';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getTeacherData } from '../api/login';

const TeacherDashboard = ({ language }) => {
  const [students, setStudents] = useState([]);
  const [teacherData, setTeacherData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('results');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [authCode,setAuthCode] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const gotoILSTest = () => {
    navigate('/ils', { state: { user: teacherData } });
  }

  const gotoILSResult = () => {
    navigate('/ilsres', { state: { user: teacherData } });
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if(location.state) {
      setAuthCode(location.state?.user);
    }
  }, [location.state]);

  useEffect(() => {
    const get = async () => {
      try {
        const data = await getTeacherData(authCode);
        setTeacherData(data.data);
      } catch (err) {
        console.error("authCode Invalid:", err);
      }
    }
    get();
  }, [authCode]);

  useEffect(() => {
    const interact = async () => {
      try {
        const data = await fetchStudents(teacherData?.students);
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    
    interact();
  }, [teacherData?.students]);
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStyleName = (styleCode) => {
    switch(styleCode) {
      case 'V': return 'Visual';
      case 'A': return 'Auditory';
      case 'R': return 'Reading/Writing';
      case 'K': return 'Kinesthetic';
      default: return styleCode;
    }
  };

  const getLearningStyleIcon = (style) => {
    switch(style) {
      case 'V': return '👁';
      case 'A': return '👂';
      case 'K': return '🏃';
      case 'R': return '📝';
      default: return '📊';
    }
  };

  const getStyleColor = (style) => {
    switch(style) {
      case 'V': return '#6a5acd'; // Visual - purple
      case 'A': return '#ffa500'; // Auditory - orange
      case 'K': return '#ff69b4'; // Kinesthetic - pink
      case 'R': return '#ff4a4a'; // Reading/Writing - red
      default: return '#20b2aa'; // Default teal
    }
  };

  const calculateClassAverages = () => {
    const averages = {
      V: 0,
      A: 0,
      R: 0,
      K: 0
    };
    
    students.forEach(student => {
      Object.entries(student.testResult.percentages).forEach(([style, value]) => {
        averages[style] += value;
      });
    });
    
    let count = 0;
    if(students) {
      count = students.length;
    }
    return {
      V: (averages.V / count).toFixed(2),
      A: (averages.A / count).toFixed(2),
      R: (averages.R / count).toFixed(2),
      K: (averages.K / count).toFixed(2)
    };
  };

  const classAverages = calculateClassAverages();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md text-sm">
          <p className="font-medium">{payload[0].name}: {payload[0].value} students</p>
          <p className="text-gray-600">{(payload[0].value / students.length * 100).toFixed(1)}% of class</p>
        </div>
      );
    }
    return null;
  };

  const calculateLearningStyleCounts = () => {
    const counts = {
      V: 0,
      A: 0,
      R: 0,
      K: 0
    };
    
    if (students && students.length > 0) {
      students.forEach(student => {
        if (student.testResult && student.testResult.dominantStyle) {
          counts[student.testResult.dominantStyle]++;
        }
      });
    }
    
    return Object.keys(counts).map(style => ({
      name: getStyleName(style),
      value: counts[style],
      color: getStyleColor(style),
      icon: getLearningStyleIcon(style)
    })).filter(item => item.value > 0);
  };

  const learningStyleData = calculateLearningStyleCounts();

  const isMobile = windowWidth < 640;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    if (isMobile) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill={learningStyleData[index].color}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="15"
        fontWeight="bold"
      >
        {`${name} (${value})`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="rounded-lg mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold">{teacherData && teacherData.name}'s Dashboard</h2>
        <p className="text-lg">Your Class Code: {teacherData && teacherData.auth}</p>
        <p className="text-lg md:text-xl">Learning Style Analysis for {students.length} students</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">ILS TEST</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={gotoILSTest}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-center transition-colors duration-200 shadow-md ${
              activeTab === 'test' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
            }`}
          >
            Give Test
          </button>
          <button
            onClick={gotoILSResult}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-center transition-colors duration-200 shadow-md ${
              activeTab === 'results' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-purple-600 border border-purple-300 hover:bg-purple-50'
            }`}
          >
            View Results
          </button>
        </div>
      </div>

      {activeTab === 'test' ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Assessment Test</h2>
          <p className="mb-4">Click the button below to start a new learning style assessment test.</p>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors">
            Start New Test
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 mb-8">
            {filteredStudents.map(student => {
              const dominantStyle = student.testResult.dominantStyle;
              const icon = getLearningStyleIcon(dominantStyle);
              const color = getStyleColor(dominantStyle);
              
              return (
                <div 
                  key={student._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden border-t-4" 
                  style={{ borderTopColor: color }}
                >
                  <div className="p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold mb-1">{student.name}</h2>
                    <p className="text-gray-600 mb-4">ID: {student.Id}</p>
                    
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-2">{icon}</span>
                      <span className="font-medium">{getStyleName(dominantStyle)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(student.testResult.percentages).map(([style, value]) => (
                        value > 0 && (
                          <div key={style} className="flex justify-between items-center">
                            <span>{getStyleName(style)}:</span>
                            <span className="font-medium">{value}%</span>
                          </div>
                        )
                      ))}
                    </div>
                    
                    <button
                      className="w-full mt-4 py-2 rounded-lg text-white font-medium"
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedStudent(student)}
                    >
                      Learning Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {teacherData && teacherData?.students?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Class Learning Style Distribution</h2>
              
              {/* Mobile-optimized layout */}
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
                {/* PIE CHART - Optimized for mobile */}
                <div className={`${isMobile ? 'h-72' : 'h-80'}`}>
                  {/* We use a different chart configuration for mobile vs desktop */}
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={learningStyleData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 30 : 0}
                        outerRadius={isMobile ? 70 : 90}
                        fill="#8884d8"
                        paddingAngle={isMobile ? 2 : 0}
                        dataKey="value"
                        labelLine={!isMobile}
                        label={renderCustomizedLabel}
                      >
                        {learningStyleData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke={isMobile ? "#fff" : entry.color}
                            strokeWidth={isMobile ? 2 : 1}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        layout={"horizontal"}
                        verticalAlign={"bottom"}
                        align={"center"}
                        iconSize={14}
                        iconType="circle"
                        formatter={(value, entry) => {
                          const style = learningStyleData.find(item => item.name === value);
                          const count = style?.value || 0;
                          return (
                            <span className="text-xs sm:text-lg">
                              {style?.icon} {value} ({count})
                            </span>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Style Breakdown */}
                <div className="flex flex-col justify-center mt-2 lg:mt-0">
                  <h3 className="text-lg md:text-xl font-medium mb-4">Student Count by Learning Style</h3>
                  <div className="space-y-3">
                    {learningStyleData.map((style) => (
                      <div key={style.name} className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-xl mr-2" style={{ color: style.color }}>{style.icon}</span>
                            <span className="font-medium">{style.name}</span>
                          </div>
                          <div className="text-base font-bold">
                            {style.value} {style.value === 1 ? 'student' : 'students'}
                            <span className="text-xs font-normal text-gray-500 ml-1">
                              ({(style.value / students.length * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-gray-200 rounded-lg p-3 font-medium text-center">
                      Total: {students.length} students
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {teacherData && teacherData?.students?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Class Learning Style Average</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(classAverages).map(([style, value]) => (
                  (parseFloat(value) > 0) && (
                    <div key={style} className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl md:text-2xl mr-2">{getLearningStyleIcon(style)}</span>
                        <span className="font-medium">{getStyleName(style)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 md:h-4">
                        <div 
                          className="h-3 md:h-4 rounded-full" 
                          style={{ 
                            width: `${value}%`, 
                            backgroundColor: getStyleColor(style)
                          }}
                        ></div>
                      </div>
                      <p className="mt-1 text-right font-medium">{value}%</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold">{selectedStudent.name}'s Profile</h2>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Learning Style Breakdown</h3>
                {Object.entries(selectedStudent.testResult.percentages).map(([style, value]) => (
                  value > 0 && (
                    <div key={style} className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{getStyleName(style)}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${value}%`, 
                            backgroundColor: getStyleColor(style) 
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                ))}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Recommended Learning Approaches</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedStudent.testResult.studyRecommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
              
              <button
                className="w-full mt-6 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: getStyleColor(selectedStudent.testResult.dominantStyle) }}
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;