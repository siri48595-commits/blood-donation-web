import axios from 'axios';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

/**
 * Send message to Groq AI
 * @param {array} messages - Array of message objects
 * @returns {promise} - Response from Groq API
 */
export const sendToGroq = async (messages) => {
  try {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      return {
        success: true,
        message: response.data.choices[0].message.content,
      };
    } else {
      return {
        success: false,
        message: 'No response from AI',
      };
    }
  } catch (error) {
    console.error('Groq API Error:', error.message);
    return {
      success: false,
      message: 'Error communicating with AI service',
      error: error.message,
    };
  }
};

/**
 * Generate donor matching explanation using AI
 * @param {object} donors - Filtered donors from database
 * @param {object} request - Blood request details
 * @returns {promise} - AI explanation
 */
export const generateDonorMatchingExplanation = async (donors, request) => {
  try {
    if (!Array.isArray(donors) || donors.length === 0) {
      return {
        success: true,
        message: 'No suitable donors found at this time. Please try again later or contact your nearest blood bank.',
        recommendations: [],
      };
    }

    const donorInfo = donors
      .map(
        (d, i) =>
          `${i + 1}. ${d.name} (${d.bloodGroup}) - Available: ${d.isAvailable ? 'Yes' : 'No'}, Location: ${d.city}, ${d.state}, Last Donation: ${d.lastDonationDate || 'Not available'}`
      )
      .join('\n');

    const prompt = `You are Bloodly AI, a blood donation matching assistant. A recipient needs ${request.bloodGroup} blood (${request.unitsRequired} units) urgently in ${request.city}.

Here are the available donors:
${donorInfo}

Based on this information:
1. Briefly explain which donors are most suitable
2. Consider blood group compatibility, availability, location, and last donation date
3. Explain your ranking (max 3 donors)
4. Include a medical disclaimer
5. Keep response concise and helpful

Format your response as JSON with: message, recommendations (array with donor names), and disclaimer.`;

    const response = await sendToGroq([
      {
        role: 'system',
        content:
          'You are Bloodly AI Assistant for blood donation management. You help identify suitable donors based on available data. You NEVER make medical decisions. Always include medical disclaimers.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    if (response.success) {
      try {
        // Try to parse as JSON
        const parsed = JSON.parse(response.message);
        return {
          success: true,
          message: parsed.message,
          recommendations: parsed.recommendations || [],
          disclaimer: parsed.disclaimer || 'Please verify with healthcare professionals.',
        };
      } catch {
        // If not JSON, return as plain text
        return {
          success: true,
          message: response.message,
          recommendations: [],
          disclaimer: 'Please verify donor suitability with healthcare professionals.',
        };
      }
    } else {
      return {
        success: false,
        message: 'Unable to generate AI explanation',
      };
    }
  } catch (error) {
    console.error('Error generating AI explanation:', error);
    return {
      success: false,
      message: 'Error generating matching explanation',
    };
  }
};

/**
 * Get AI response to general query
 * @param {string} userQuery - User question
 * @param {string} userRole - User role (DONOR, RECIPIENT, ADMIN)
 * @returns {promise} - AI response
 */
export const getAIAssistantResponse = async (userQuery, userRole = 'RECIPIENT') => {
  try {
    const systemPrompt = `You are Bloodly AI Assistant, a helpful guide for blood donation management.
Your role is to assist ${userRole}s with questions about:
- Finding donors
- Registering as a donor
- Managing profiles
- Creating blood requests
- Emergency requests
- Blood group information
- How donor matching works
- Platform navigation

Important guidelines:
- NEVER provide medical advice
- NEVER make medical eligibility decisions
- NEVER diagnose conditions
- Always recommend consulting healthcare professionals for medical concerns
- Be empathetic, clear, and concise
- Provide helpful information about platform features
- When uncertain, suggest contacting support or a healthcare professional

Always include appropriate disclaimers about medical matters.`;

    const response = await sendToGroq([
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userQuery,
      },
    ]);

    if (response.success) {
      return {
        success: true,
        message: response.message,
        role: 'assistant',
      };
    } else {
      return {
        success: false,
        message: 'Error getting AI response',
      };
    }
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      success: false,
      message: 'Error communicating with AI assistant',
    };
  }
};

export default {
  sendToGroq,
  generateDonorMatchingExplanation,
  getAIAssistantResponse,
};
