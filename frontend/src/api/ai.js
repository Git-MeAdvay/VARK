import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_API;

export const generateInsights = async (V,A,R,K) => {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
        const input = `I have the following VARK test result percentages:
                        Visual: ${V}%
                        Auditory: ${A}%
                        Reading/Writing: ${R}%
                        Kinesthetic: ${K}%
                    Based on this data, provide a comprehensive learning insight. Include:
                        The dominant learning style(s) and what it means.   
                        Practical study strategies tailored to the user's strengths.    
                        Suggestions for improving weaker modalities if needed.  
                        Types of resources or tools the user should use (e.g., videos, books, apps).
                        A brief personalized learning plan incorporating their learning style.

                    Make sure to use simple language and avoid technical jargon.
                    Note: Don't use any code blocks or markdown formatting.
                    Keep the response concise and focused on actionable insights.
                    `;

        const result = await model.generateContent(input);
        return result.response.text();
    } catch (error) {
      console.error('Error generating Insights:', error);
    }
  };

  export const generateInsightsMR = async (V,A,R,K) => {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
        const input = `I have the following VARK test result percentages:
                        Visual: ${V}%
                        Auditory: ${A}%
                        Reading/Writing: ${R}%
                        Kinesthetic: ${K}%
                    Based on this data, provide a comprehensive learning insight. Include:
                        The dominant learning style(s) and what it means.   
                        Practical study strategies tailored to the user's strengths.    
                        Suggestions for improving weaker modalities if needed.  
                        Types of resources or tools the user should use (e.g., videos, books, apps).
                        A brief personalized learning plan incorporating their learning style.

                    Make sure to use simple language and avoid technical jargon.
                    Note: Don't use any code blocks or markdown formatting.
                    Keep the response concise and focused on actionable insights.
                    Convert the response to Marathi language.
                    `;

        const result = await model.generateContent(input);
        return result.response.text();
    } catch (error) {
      console.error('Error generating Insights:', error);
    }
  };