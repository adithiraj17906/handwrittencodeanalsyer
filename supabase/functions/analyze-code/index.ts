import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, language } = await req.json();

    if (!image) {
      throw new Error('No image provided');
    }

    // Support both GEMINI_API_KEY and the original key name just in case, but prefer GEMINI_API_KEY
    const API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('LOVABLE_API_KEY');
    if (!API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    console.log('Analyzing handwritten code with Gemini...', { language: language || 'auto-detect' });

    const languageInstruction = language
      ? `The code is written in ${language}. Analyze it according to ${language} syntax rules.`
      : 'Auto-detect the programming language from the code.';

    // Extract base64 (remove data:image/jpeg;base64, prefix if present)
    const base64Image = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const prompt = `
      You are an expert code analyzer supporting ALL programming languages.
      Analyze handwritten code from the provided image.
      
      CRITICAL INSTRUCTION:
      If the image does NOT contain any handwritten or printed code (e.g., it contains only a person, face, background, or irrelevant objects), you MUST return this exact JSON structure:
      {
        "code": "",
        "language": "None",
        "errors": [],
        "correctedCode": "",
        "expectedOutput": "No code detected in the image. Please show a clear image of handwritten code."
      }

      Only if valid code is visible, proceed with:
      1. Extract the exact code text character by character.
      2. ${languageInstruction}
      3. Find ALL syntax errors with precise line numbers (1-indexed).
      4. Check for common mistakes like typos, missing brackets, incorrect indentation.
      5. Provide a corrected version of the code with all errors fixed.
      6. Predict the expected output if the corrected code were to run.
      
      Return ONLY valid JSON in this exact format:
      {
        "code": "extracted code as string with \\n for line breaks",
        "language": "detected language name",
        "errors": [
          {"line": number, "message": "detailed error description", "type": "error" | "warning"}
        ],
        "correctedCode": "the corrected version of the code",
        "expectedOutput": "The expected output"
      }
    `;

    // Call Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini analysis failed: ${response.status} - ${errorText}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No response content from Gemini');
    }

    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', content);
      throw new Error('Could not parse analysis results');
    }

    console.log('Analysis complete:', {
      language: result.language,
      errorCount: result.errors?.length || 0
    });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-code function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
