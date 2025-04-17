import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Available models
const AVAILABLE_MODELS = {
  "gpt-3.5-turbo": {
    name: "GPT-3.5 Turbo",
    description: "Fast and efficient for most assignments",
    maxTokens: 2000
  },
  "gpt-4o": {
    name: "GPT-4o",
    description: "Latest and most advanced model with superior understanding",
    maxTokens: 4000
  },
  "gpt-4-turbo": {
    name: "GPT-4 Turbo",
    description: "Powerful model for complex assignments",
    maxTokens: 4000
  },
  "gpt-4": {
    name: "GPT-4",
    description: "Strong reasoning capabilities for detailed analysis",
    maxTokens: 4000
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { parsedText, model = "gpt-3.5-turbo" } = req.body;

    if (!parsedText) {
      return res.status(400).json({ error: 'Parsed text is required' });
    }
    
    // Validate model choice
    const modelToUse = AVAILABLE_MODELS[model] ? model : "gpt-3.5-turbo";
    const maxTokens = AVAILABLE_MODELS[modelToUse].maxTokens;

    // Prepare prompt for OpenAI
    const prompt = `You are an educational assistant helping a student understand their assignment.

    Please analyze the following assignment text and return a clear, structured breakdown with the following sections using proper Markdown formatting:
    
    # 📄 Assignment Overview
    Provide a short summary of what this assignment is about.
    
    # ✅ Tasks Breakdown
    List and number all key tasks or questions that the student needs to complete. Keep each task concise and actionable.
    
    # 🎯 Key Concepts
    Identify the important concepts, terms, or subject areas that are critical for completing the assignment.
    
    # ⏱️ Time Estimates
    Estimate how much time (in hours) each task might take. List each task alongside its estimated duration.
    
    # 🧠 Suggested Approach
    Outline a step-by-step strategy the student can follow to efficiently complete the assignment.
    
    # 📚 Helpful Resources
    Recommend useful references, tools, websites, or reading materials that would support the completion of this assignment.
    
    ---
    
    Format your response in Markdown using headings, bullet points, and numbered lists. Keep the tone student-friendly, focused, and helpful. Avoid unnecessary repetition or fluff.
    
    Here is the assignment text:
    ${parsedText.slice(0, 8000)}
    `;
        
    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          {"role": "system", "content": "You are a helpful educational assistant that analyzes academic assignments and breaks them down into manageable parts."},
          {"role": "user", "content": prompt}
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      });
      
      const analysis = completion.choices[0].message.content;
      
      // Log the response for debugging
      console.log("OpenAI response received:", {
        model: modelToUse,
        tokens: completion.usage,
        firstFewWords: analysis.substring(0, 50) + "..."
      });
      
      // Return the analysis
      return res.status(200).json({ 
        success: true, 
        aiBreakdown: analysis,
        modelUsed: modelToUse
      });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // If the selected model failed, fallback to GPT-3.5
      if (modelToUse !== "gpt-3.5-turbo") {
        console.log(`Falling back to gpt-3.5-turbo after error with ${modelToUse}`);
        
        const fallbackCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {"role": "system", "content": "You are a helpful educational assistant that analyzes academic assignments and breaks them down into manageable parts."},
            {"role": "user", "content": prompt}
          ],
          temperature: 0.7,
          max_tokens: 2000,
        });
        
        const fallbackAnalysis = fallbackCompletion.choices[0].message.content;
        
        return res.status(200).json({ 
          success: true, 
          aiBreakdown: fallbackAnalysis,
          modelUsed: "gpt-3.5-turbo (fallback)",
          originalModelError: openaiError.message
        });
      } else {
        throw openaiError; // Re-throw if already using the fallback model
      }
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return res.status(500).json({ error: error.message || 'An error occurred while processing with OpenAI' });
  }
} 