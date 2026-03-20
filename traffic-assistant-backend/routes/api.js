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

// POST: Analyze text input via Gemini
router.post('/analyze/text', async (req, res) => {
  try {
    const { text } = req.body;
    
    // We prompt Gemini to act as a traffic analyzer
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this user traffic report: "${text}". 
      Extract the following JSON structure: 
      { "severity": "low/medium/high", "type": "accident/congestion/roadblock/other", "location_clue": "string", "recommendation": "string" }.
      Respond ONLY in valid JSON.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON strictly from Gemini response
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(jsonStr);

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze text' });
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

export default router;
