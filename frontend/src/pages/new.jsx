import React, { useState } from 'react';
import { Search } from 'lucide-react';

const TeacherDashboard = () => {
  // Demo data - this would come from your backend in a real app
  const teacherData = {
    name: "Ms. Sarah Johnson",
    students: [
      { id: 1, name: "Alex Smith", criticalThinking: 85, problemSolving: 78, creativity: 92, learningIndex: 85, preference: "visual" },
      { id: 2, name: "Taylor Williams", criticalThinking: 72, problemSolving: 88, creativity: 65, learningIndex: 75, preference: "aural" },
      { id: 3, name: "Jordan Brown", criticalThinking: 65, problemSolving: 70, creativity: 80, learningIndex: 72, preference: "read/write" },
      { id: 4, name: "Casey Davis", criticalThinking: 95, problemSolving: 92, creativity: 88, learningIndex: 92, preference: "kinesthetic" },
      { id: 5, name: "Morgan Wilson", criticalThinking: 75, problemSolving: 82, creativity: 78, learningIndex: 78, preference: "visual" },
      { id: 6, name: "Jamie Garcia", criticalThinking: 82, problemSolving: 75, creativity: 90, learningIndex: 82, preference: "aural" },
      { id: 7, name: "Riley Martinez", criticalThinking: 68, problemSolving: 72, creativity: 85, learningIndex: 75, preference: "read/write" },
      { id: 8, name: "Avery Johnson", criticalThinking: 88, problemSolving: 85, creativity: 72, learningIndex: 82, preference: "kinesthetic" },
      { id: 9, name: "Cameron Lee", criticalThinking: 79, problemSolving: 81, creativity: 74, learningIndex: 78, preference: "visual" },
      { id: 10, name: "Jesse Thompson", criticalThinking: 90, problemSolving: 86, creativity: 88, learningIndex: 88, preference: "aural" },
      { id: 11, name: "Drew Anderson", criticalThinking: 70, problemSolving: 75, creativity: 92, learningIndex: 79, preference: "read/write" },
      { id: 12, name: "Parker Wright", criticalThinking: 84, problemSolving: 78, creativity: 86, learningIndex: 83, preference: "kinesthetic" },
      { id: 13, name: "Quinn Martinez", criticalThinking: 86, problemSolving: 89, creativity: 77, learningIndex: 84, preference: "visual" },
      { id: 14, name: "Logan Taylor", criticalThinking: 77, problemSolving: 83, creativity: 91, learningIndex: 84, preference: "aural" },
      { id: 15, name: "Reese Campbell", criticalThinking: 89, problemSolving: 84, creativity: 76, learningIndex: 83, preference: "read/write" },
    ]
  };

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fix for mobile scrolling issue when dialog is open
  React.useEffect(() => {
    if (dialogOpen) {
      // Prevent background scrolling when dialog is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when dialog is closed
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [dialogOpen]);
  
  // Filter students based on search term
  const filteredStudents = teacherData.students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // VARK theme colors from the image
  const VARK_COLORS = {
    visual: '#e6f0ff',      // Light blue
    aural: '#e6ffe6',       // Light green
    'read/write': '#ffe6ff', // Light purple
    kinesthetic: '#fff5e6'  // Light orange
  };
  
  const VARK_ACCENT_COLORS = {
    visual: '#3366cc',      // Darker blue
    aural: '#33cc33',       // Darker green
    'read/write': '#cc33cc', // Darker purple
    kinesthetic: '#ff9933'  // Darker orange
  };
  
  // Theme colors
  const THEME = {
    primary: '#ff9933',     // Orange (from Start Assessment button)
    secondary: '#666666',   // Gray
    dark: '#333333',        // Black
    light: '#f5f5f5',       // Light gray
    white: '#ffffff'        // White
  };

  // Handle student card click
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  // Get learning index analysis text
  const getLearningAnalysis = (index) => {
    if (index >= 90) return "Outstanding learner with exceptional abilities across multiple domains.";
    if (index >= 80) return "Strong learner who excels in most areas and shows good potential for growth.";
    if (index >= 70) return "Solid learner with balanced abilities and opportunities for targeted improvement.";
    if (index >= 60) return "Developing learner who would benefit from additional support in specific areas.";
    return "Emerging learner who needs comprehensive support to build foundational skills.";
  };

  // Get VARK-based learning style description
  const getVarkDescription = (preference) => {
    switch(preference) {
      case 'visual':
        return "Visual learner who benefits from images, diagrams, and spatial understanding.";
      case 'aural':
        return "Aural learner who processes information best through sound and music.";
      case 'read/write':
        return "Read/Write learner who prefers words, reading materials, and writing activities.";
      case 'kinesthetic':
        return "Kinesthetic learner who learns best through movement, hands-on activities, and touch.";
      default:
        return "Learning style not determined.";
    }
  };

  // Get recommendations based on metrics and VARK style
  const getRecommendations = (student) => {
    const recommendations = [];
    
    // Base recommendations on learning metrics
    if (student.criticalThinking < 75) {
      recommendations.push("Provide more analytical exercises and encourage questioning assumptions.");
    }
    
    if (student.problemSolving < 75) {
      recommendations.push("Introduce structured problem-solving frameworks and real-world challenges.");
    }
    
    if (student.creativity < 75) {
      recommendations.push("Incorporate more open-ended projects and brainstorming activities.");
    }
    
    // Add VARK-specific recommendations
    switch(student.preference) {
      case 'visual':
        recommendations.push("Use more diagrams, charts, and visual materials to explain concepts.");
        break;
      case 'aural':
        recommendations.push("Incorporate discussions, audio materials, and musical elements into lessons.");
        break;
      case 'read/write':
        recommendations.push("Provide written instructions and encourage note-taking and writing exercises.");
        break;
      case 'kinesthetic':
        recommendations.push("Include hands-on activities, role-playing, and movement-based learning tasks.");
        break;
      default:
        break;
    }
    
    return recommendations.length > 0 ? recommendations : ["Continue with current learning plan to maintain strong performance."];
  };

  // Custom card component
  const Card = ({ children, className, style, onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow-sm ${className || ''}`} 
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );

  // Custom modal/dialog
  const Dialog = ({ open, onClose, children }) => {
    if (!open) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto w-full">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header Card */}
        <Card className="mb-8 bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg">
          <div className="p-6">
            <h1 className="text-3xl font-bold">{teacherData.name}'s Dashboard</h1>
            <p className="text-orange-100 text-lg">
              VARK Learning Style Assessment for {teacherData.students.length} students
            </p>
          </div>
        </Card>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 h-12 text-lg shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <Card 
              key={student.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-t-4"
              style={{ borderTopColor: VARK_ACCENT_COLORS[student.preference], backgroundColor: VARK_COLORS[student.preference] }}
              onClick={() => handleStudentClick(student)}
            >
              <div className="p-5 pb-2">
                <h2 className="text-xl font-bold truncate">{student.name}</h2>
                <p className="text-sm text-gray-500">ID: {student.id}</p>
              </div>
              <div className="p-5 pt-0">
                <div className="mt-2 flex justify-between">
                  <span className="font-medium">Learning Index:</span> 
                  <span className="font-bold" style={{ color: VARK_ACCENT_COLORS[student.preference] }}>
                    {student.learningIndex}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="font-medium">VARK Style:</span> 
                  <span className="font-bold capitalize" style={{ color: VARK_ACCENT_COLORS[student.preference] }}>
                    {student.preference}
                  </span>
                </div>
              </div>
              <div className="p-5 pt-0" style={{ backgroundColor: THEME.light }}>
                <button 
                  className="w-full py-2 px-4 rounded-md text-white font-medium"
                  style={{ backgroundColor: VARK_ACCENT_COLORS[student.preference] }}
                >
                  View Analysis
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Student Details Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          {selectedStudent && (
            <>
              <div className="p-6 border-b" style={{ backgroundColor: VARK_COLORS[selectedStudent.preference] }}>
                <h2 className="text-2xl font-bold" style={{ color: VARK_ACCENT_COLORS[selectedStudent.preference] }}>
                  {selectedStudent.name}'s Learning Analysis
                </h2>
                <p className="text-base text-gray-500">
                  VARK Learning Style: <span className="font-medium capitalize">{selectedStudent.preference}</span>
                </p>
              </div>
              
              <div className="p-6">
                {/* Image placeholder for charts/visualizations */}
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-6">
                  <p className="text-gray-500 text-lg">Chart/Visualization Placeholder</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3" style={{ color: VARK_ACCENT_COLORS[selectedStudent.preference] }}>
                    Learning Metrics:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span>Critical Thinking:</span> 
                      <span className="font-medium">{selectedStudent.criticalThinking}/100</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Problem Solving:</span> 
                      <span className="font-medium">{selectedStudent.problemSolving}/100</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Creativity:</span> 
                      <span className="font-medium">{selectedStudent.creativity}/100</span>
                    </li>
                    <li className="flex justify-between border-t pt-2 mt-2">
                      <span className="font-semibold">Learning Index:</span> 
                      <span className="font-bold" style={{ color: VARK_ACCENT_COLORS[selectedStudent.preference] }}>
                        {selectedStudent.learningIndex}/100
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="px-6 pb-4">
                <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-lg mb-3" style={{ color: VARK_ACCENT_COLORS[selectedStudent.preference] }}>
                    Learning Analysis:
                  </h3>
                  <p className="mb-2">
                    {getLearningAnalysis(selectedStudent.learningIndex)}
                  </p>
                  
                  <p className="mb-4">
                    <span className="font-medium">VARK Profile:</span> {getVarkDescription(selectedStudent.preference)}
                  </p>
                  
                  <h4 className="font-semibold mb-2">Recommendations:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {getRecommendations(selectedStudent).map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="p-6 pt-2">
                <button 
                  className="mt-2 w-full text-base py-2 px-4 rounded-md text-white font-medium"
                  style={{ backgroundColor: THEME.primary }}
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default TeacherDashboard;