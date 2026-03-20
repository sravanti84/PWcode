import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import admin from 'firebase-admin';

const router = express.Router();

// Initialize Gemini
// NOTE: Make sure GEMINI_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// Try initializing Firebase (Requires valid credentials)
try {
  if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
} catch (error) {
  console.log('Firebase init failed or skipped. Mocking DB.');
}

// In-memory array for mocked data
const mockReports = [
  { id: 1, type: 'Congestion', text: 'Heavy traffic near the north gate', lat: 28.6139, lng: 77.2090, timestamp: new Date() }
];

// POST: Analyze report (text + optional image) via Gemini
router.post('/analyze/text', async (req, res) => {
  try {
    const { text, image } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let promptParts = [
      `Analyze this user traffic report: "${text}". 
      Extract the following JSON structure: 
      { "severity": "low/medium/high", "type": "accident/congestion/roadblock/other", "location_clue": "string", "recommendation": "string", "is_image_relevant": boolean, "rejection_reason": "string" }.
      
      CRITICAL RULES:
      1. If the report type is 'accident' or 'congestion', an image MUST be provided.
      2. If an image is provided, verify if it is a real street-level photo relevant to a traffic incident.
      3. If the image is unrelated (e.g., a pet, food, indoor shot), set "is_image_relevant" to false and provide a reason.
      4. Respond ONLY in valid JSON.`
    ];

    if (image) {
      const base64Data = image.split(",")[1] || image;
      promptParts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg" // Defaulting to jpeg, frontend usually sends this
        }
      });
    } else {
      // Check if text implies accident/congestion but no image was provided
      const lowerText = text.toLowerCase();
      if (lowerText.includes('accident') || lowerText.includes('jam') || lowerText.includes('traffic') || lowerText.includes('congestion')) {
        return res.status(400).json({ 
          success: false, 
          error: "A photo is mandatory for reporting accidents or heavy traffic jams." 
        });
      }
    }

    const result = await model.generateContent(promptParts);
    const responseText = result.response.text();
    
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(jsonStr);

    if (image && analysis.is_image_relevant === false) {
      return res.status(400).json({ 
        success: false, 
        error: `Photo Rejected: ${analysis.rejection_reason || "The uploaded image does not appear to be a relevant traffic photo."}`
      });
    }

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze report' });
  }
});

// GET: Fetch all reports for heatmaps
router.get('/reports', async (req, res) => {
  // Normally you fetch from admin.firestore().collection('reports').get()
  res.json({ success: true, reports: mockReports });
});

// POST: Submit a new report (Community Reporting)
router.post('/reports', async (req, res) => {
  const newReport = { id: Date.now(), ...req.body, timestamp: new Date() };
  mockReports.push(newReport);
  // Optional: Save to Firebase here
  res.json({ success: true, report: newReport });
});

// POST: Analyze multiple routes against community reports
router.post('/analyze/route', async (req, res) => {
  try {
    const { routes, reports } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      As an Intelligent Traffic Assistant, compare these suggested driving routes against the real-time community reports.
      
      ROUTES:
      ${JSON.stringify(routes)}
      
      COMMUNITY REPORTS (Accidents, Jams, etc.):
      ${JSON.stringify(reports)}
      
      TASK:
      1. Analyze if any route passes through or very near a reported incident location.
      2. Provide a 'Verdict' recommendation for the user.
      3. Format the response as JSON: { "recommended_route_index": number, "verdict": "string", "reasoning": "string" }.
      
      Example Verdict: "Route 1 is technically fastest, but there is a confirmed accident at its midpoint. We recommend Route 2 (Alternative) to avoid a potential 15-minute delay."
      
      Respond only in valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(jsonStr);

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Route analysis error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze routes' });
  }
});

export default router;
