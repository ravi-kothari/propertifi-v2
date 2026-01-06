import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// State-specific landlord-tenant law summaries for RAG context
const stateLawsData: Record<string, string> = {
    california: `
CALIFORNIA LANDLORD-TENANT LAW SUMMARY:

SECURITY DEPOSITS:
- Maximum: 2 months' rent for unfurnished, 3 months' for furnished units
- Must be returned within 21 days of move-out
- Itemized statement required for any deductions
- Interest payment required in some cities (Los Angeles, San Francisco, etc.)

RENT CONTROL:
- Statewide rent cap (AB 1482): 5% + local CPI or 10%, whichever is lower
- Applies to buildings 15+ years old
- Exemptions for single-family homes (with notice), new construction

EVICTIONS:
- Just cause required for most tenancies over 12 months
- 3-day notice for nonpayment of rent
- 30-day notice for month-to-month (under 1 year tenancy)
- 60-day notice for tenancies over 1 year
- Relocation assistance required for no-fault evictions

DISCLOSURES REQUIRED:
- Lead-based paint (pre-1978 buildings)
- Bed bug history
- Mold disclosure
- Flood zone
- Demolition intent
- Sex offender database notice
`,
    texas: `
TEXAS LANDLORD-TENANT LAW SUMMARY:

SECURITY DEPOSITS:
- No statutory limit on amount
- Must be returned within 30 days of move-out
- Written itemization required for deductions
- Can be applied to unpaid rent, damages, cleaning, re-letting fees

RENT CONTROL:
- Prohibited by state law
- No local rent control ordinances allowed
- Landlords can raise rent with proper notice

EVICTIONS:
- No just cause requirement
- 3-day notice to vacate for nonpayment (can be 1 day if specified in lease)
- 30-day notice for month-to-month (unless lease says otherwise)
- Very landlord-friendly eviction process

DISCLOSURES REQUIRED:
- Lead-based paint (pre-1978 buildings)
- Right to repair notice
- Tenant rights information
- Flood zone disclosure (if known)
- Property owner/manager identification

REPAIRS:
- Landlord must repair conditions affecting health/safety
- Tenant must give written notice
- Reasonable time to repair (7 days for critical issues)
`,
    florida: `
FLORIDA LANDLORD-TENANT LAW SUMMARY:

SECURITY DEPOSITS:
- No statutory limit on amount
- Must be returned within 15-30 days depending on deductions
- If claiming deductions: 30 days with itemized notice
- Must be held in Florida bank or surety bond

RENT CONTROL:
- Prohibited by state law (except emergency situations)
- No local rent control allowed

EVICTIONS:
- 3-day notice for nonpayment of rent
- 7-day notice for lease violations (with cure option)
- 15-day notice for month-to-month tenancy
- Self-help evictions prohibited

DISCLOSURES REQUIRED:
- Lead-based paint (pre-1978)
- Radon gas disclosure
- Security deposit location and terms
- Landlord's name and address

REPAIRS:
- Landlord must maintain premises in compliance with building codes
- Tenant may withhold rent if landlord fails to maintain (with proper notice)
`,
    newyork: `
NEW YORK LANDLORD-TENANT LAW SUMMARY:

SECURITY DEPOSITS:
- Maximum: 1 month's rent (statewide since 2019)
- Must be returned within 14 days of move-out
- Must be held in interest-bearing account
- Itemized statement required

RENT CONTROL/STABILIZATION:
- NYC and some counties have rent stabilization
- Strict rules on rent increases (Rent Guidelines Board)
- Just cause eviction for regulated units
- Good cause eviction law (2024) for many market-rate units

EVICTIONS:
- 14-day notice for nonpayment (demand for rent)
- 30-day notice for lease violations
- Court eviction only (no self-help)
- Extensive tenant protections in housing court

DISCLOSURES REQUIRED:
- Lead-based paint
- Bed bug history
- Rent stabilization status
- Smoking policy
- Flood zone (NYC)
- Landlord's name and address

REPAIRS:
- Implied warranty of habitability
- Tenant can withhold rent for serious violations
- NYC HPD code enforcement
`,
    arizona: `
ARIZONA LANDLORD-TENANT LAW SUMMARY:

SECURITY DEPOSITS:
- Maximum: 1.5 months' rent
- Must be returned within 14 days of move-out
- Itemized statement required for deductions
- Can deduct for cleaning, damages, unpaid rent

RENT CONTROL:
- Prohibited by state law
- Cities cannot enact rent control

EVICTIONS:
- 5-day notice for nonpayment of rent
- 10-day notice for lease violations (health/safety: 5 days)
- Immediate termination for specific crimes
- 30-day notice for month-to-month

DISCLOSURES REQUIRED:
- Lead-based paint (pre-1978)
- Move-in/move-out checklist
- Landlord/agent identification
- Pool safety notice
- Crime-free addendum (if applicable)

REPAIRS:
- Landlord must maintain fit and habitable condition
- 5 days to repair after written notice (2 days for emergencies)
- Tenant may arrange repair and deduct (up to $300 or half month's rent)
`,
};

const systemPrompt = `You are a helpful property law assistant for Propertifi, a real estate platform. Your role is to provide accurate, helpful information about landlord-tenant laws in the United States.

IMPORTANT GUIDELINES:
1. Always be clear that you're providing general information, NOT legal advice
2. Recommend consulting a local attorney for specific situations
3. Stay focused on landlord-tenant law topics: security deposits, rent control, evictions, lease requirements, repairs, disclosures, fair housing
4. If you don't know something, say so rather than guessing
5. Be concise but thorough
6. Always specify which state's laws you're discussing
7. Cite specific rules and timeframes when available

When answering questions, use the provided state law information when available. If the user asks about a state not in your knowledge base, provide general guidance and encourage them to check their state's specific laws.

Start each response by confirming which state's laws you're discussing if relevant.

DISCLAIMER: Always remind users that laws change and they should verify current regulations with local authorities or a licensed attorney.`;

export async function POST(req: NextRequest) {
    try {
        const { message, state, conversationHistory = [] } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
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

        // Build context with state-specific laws if available
        let context = systemPrompt;
        if (state && stateLawsData[state.toLowerCase()]) {
            context += `\n\nRELEVANT STATE LAW INFORMATION:\n${stateLawsData[state.toLowerCase()]}`;
        }

        // Build conversation history for context
        const chatHistory = conversationHistory.map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
        });

        // Include context in the first message if no history
        const fullMessage = chatHistory.length === 0
            ? `${context}\n\nUser question: ${message}`
            : message;

        const result = await chat.sendMessage(fullMessage);
        const response = result.response.text();

        return NextResponse.json({
            response,
            state: state || null,
        });
    } catch (error: any) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process chat request' },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Return available states for the selector
    return NextResponse.json({
        available_states: Object.keys(stateLawsData).map(state => ({
            id: state,
            name: state.charAt(0).toUpperCase() + state.slice(1),
        })),
    });
}
