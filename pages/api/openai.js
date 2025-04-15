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
    const prompt = `You are an educational assistant analyzing an assignment document. 
    Analyze the following assignment text and provide a structured breakdown with these clearly labeled sections:

    # Assignment Overview
    Start with a brief summary of what the assignment is about.

    # Tasks Breakdown
    Provide a detailed breakdown of all questions or tasks that need to be completed, with each task clearly numbered.

    # Key Concepts
    List the important concepts, terms, and references mentioned that will be helpful for completing the assignment.

    # Time Estimate
    Provide an estimated time to complete each part (in hours).

    # Approach Strategy
    Suggest a step-by-step approach for tackling the assignment efficiently.

    # Resources Needed
    List any specific resources, references, or tools that would be helpful.

    Format your response using proper Markdown with headings, lists, and emphasis. Keep it concise, well-structured, and student-friendly.
    
    Here is the assignment text:
    ${parsedText.slice(0, 8000)}`; // Limiting text to avoid token limitations
    
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