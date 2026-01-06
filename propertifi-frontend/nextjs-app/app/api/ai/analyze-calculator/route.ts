import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

interface CalculatorInput {
    calculatorType: string;
    inputs: Record<string, number | string>;
    results: Record<string, number | string>;
}

const systemPrompt = `You are an expert real estate investment analyst for Propertifi. Your role is to analyze calculator results and provide actionable insights.

When analyzing a deal, you MUST return a JSON response with this exact structure:
{
  "dealScore": <number 1-100>,
  "dealRating": "<Excellent|Good|Fair|Poor>",
  "summary": "<2-3 sentence summary of the deal quality>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "concerns": ["<concern 1>", "<concern 2>", ...],
  "suggestions": [
    {"title": "<suggestion title>", "impact": "<what would improve>", "change": "<specific change to make>"}
  ],
  "marketContext": "<brief context about typical returns in this investment type>",
  "riskLevel": "<Low|Medium|High>",
  "keyMetrics": [
    {"name": "<metric name>", "value": "<value>", "assessment": "<good/average/poor>"}
  ]
}

SCORING GUIDELINES:
- Cap Rate: <4% = Poor, 4-6% = Fair, 6-8% = Good, >8% = Excellent
- Cash-on-Cash Return: <6% = Poor, 6-10% = Fair, 10-15% = Good, >15% = Excellent
- Monthly Cash Flow: Negative = Poor, $0-200 = Fair, $200-500 = Good, >$500 = Excellent
- ROI: <5% = Poor, 5-10% = Fair, 10-15% = Good, >15% = Excellent

For BRRRR deals, also consider:
- Equity captured after refinance
- All-in cost vs ARV ratio

For Buy vs Rent, consider:
- Break-even timeline
- Opportunity cost of down payment

Be specific with numbers in your suggestions. Don't be vague.
IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, just the raw JSON object.`;

export async function POST(req: NextRequest) {
    try {
        const { calculatorType, inputs, results }: CalculatorInput = await req.json();

        if (!calculatorType || !inputs || !results) {
            return NextResponse.json(
                { error: 'Calculator type, inputs, and results are required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Format the analysis request
        const analysisRequest = `
Analyze this ${calculatorType} calculator result:

INPUT DATA:
${JSON.stringify(inputs, null, 2)}

CALCULATED RESULTS:
${JSON.stringify(results, null, 2)}

Provide a comprehensive deal analysis with scoring, strengths, concerns, and specific improvement suggestions.
Return ONLY the JSON object, no other text.`;

        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt + '\n\n' + analysisRequest }],
                },
            ],
            generationConfig: {
                temperature: 0.3, // Lower temperature for more consistent JSON
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            },
        });

        const responseText = result.response.text();

        // Parse the JSON response
        let analysis;
        try {
            // Clean up potential markdown code blocks
            let cleanedResponse = responseText.trim();
            if (cleanedResponse.startsWith('```json')) {
                cleanedResponse = cleanedResponse.slice(7);
            }
            if (cleanedResponse.startsWith('```')) {
                cleanedResponse = cleanedResponse.slice(3);
            }
            if (cleanedResponse.endsWith('```')) {
                cleanedResponse = cleanedResponse.slice(0, -3);
            }
            analysis = JSON.parse(cleanedResponse.trim());
        } catch (parseError) {
            console.error('Failed to parse AI response:', responseText);
            // Return a fallback structured response
            analysis = {
                dealScore: 50,
                dealRating: 'Fair',
                summary: 'Analysis could not be fully processed. Please review the numbers manually.',
                strengths: ['Data provided for analysis'],
                concerns: ['Unable to fully analyze - please verify inputs'],
                suggestions: [],
                marketContext: 'Compare with local market benchmarks.',
                riskLevel: 'Medium',
                keyMetrics: [],
                rawResponse: responseText,
            };
        }

        return NextResponse.json({
            success: true,
            analysis,
            calculatorType,
        });
    } catch (error: any) {
        console.error('AI Analysis error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze calculator results' },
            { status: 500 }
        );
    }
}
