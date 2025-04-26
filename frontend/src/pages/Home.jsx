import React from 'react';
import { BookOpen, Ear, Eye, PenTool, Target, Brain, Puzzle, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12 pt-8">
          <div className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg mb-6 transform -rotate-2 shadow-lg">
            <h1 className="text-4xl font-bold">Discover Your Learning Style</h1>
          </div>
          <p className="text-xl text-orange-800 mt-4">Unlock your full potential by understanding how you learn best</p>
        </header>
        
        {/* Benefits Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-xl p-8 border-t-8 border-orange-500">
            <h2 className="text-3xl font-bold mb-8 text-center text-orange-700">Benefits of Knowing Your Style</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-orange-50 p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-orange-400 text-white rounded-full">
                  <Brain size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-orange-800">Better Study Habits</h3>
                <p className="text-gray-700">Develop study techniques that align with your natural learning preferences</p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-orange-400 text-white rounded-full">
                  <Award size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-orange-800">More Effective Learning</h3>
                <p className="text-gray-700">Absorb and retain information more efficiently when using methods that match your style</p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-orange-400 text-white rounded-full">
                  <Puzzle size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-orange-800">Personalized Strategies</h3>
                <p className="text-gray-700">Create customized learning approaches that work specifically for you</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* VARK Types Preview */}
        <section className="mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-300 transform -rotate-1 rounded-xl"></div>
            <div className="relative bg-white rounded-xl shadow-xl p-8 border-b-8 border-orange-500">
              <h2 className="text-3xl font-bold mb-8 text-center text-orange-700">Preview of the VARK Types</h2>
              <p className="text-center text-lg mb-8">Everyone has unique preferences for how they best absorb information. Discover yours:</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-b from-orange-50 to-orange-100 p-6 rounded-lg shadow-md border-t-4 border-orange-400 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-400 p-3 rounded-full">
                      <Eye size={32} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center text-orange-800">Visual</h3>
                  <p className="text-gray-700">Learns through images, diagrams, charts, and visual representations</p>
                </div>
                
                <div className="bg-gradient-to-b from-orange-50 to-orange-100 p-6 rounded-lg shadow-md border-t-4 border-orange-400 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-400 p-3 rounded-full">
                      <Ear size={32} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center text-orange-800">Auditory</h3>
                  <p className="text-gray-700">Prefers listening to information through lectures, discussions, and audio content</p>
                </div>
                
                <div className="bg-gradient-to-b from-orange-50 to-orange-100 p-6 rounded-lg shadow-md border-t-4 border-orange-400 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-400 p-3 rounded-full">
                      <BookOpen size={32} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center text-orange-800">Reading/Writing</h3>
                  <p className="text-gray-700">Likes written words, lists, textbooks, and note-taking</p>
                </div>
                
                <div className="bg-gradient-to-b from-orange-50 to-orange-100 p-6 rounded-lg shadow-md border-t-4 border-orange-400 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-400 p-3 rounded-full">
                      <PenTool size={32} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center text-orange-800">Kinesthetic</h3>
                  <p className="text-gray-700">Learns by doing through hands-on activities, movement, and practical experiences</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="text-center bg-orange-500 text-white p-8 rounded-xl shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-4">Ready to discover your learning style?</h2>
          <p className="mb-6">Take our assessment to find out which methods work best for you</p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-100 transition-colors shadow-md">
            Take the VARK Assessment
          </button>
        </section>
        
        {/* Fun Footer Element */}
        <div className="flex justify-center mb-8">
          <div className="bg-orange-200 p-4 rounded-lg shadow inline-block transform rotate-2">
            <p className="text-orange-800 font-medium">Learn smarter, not harder!</p>
          </div>
        </div>
      </div>
    </div>
  );
}