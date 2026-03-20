# Local Traffic Assistant

An intelligent traffic management web application designed for residential societies and urban areas. It leverages AI (Gemini APIs) to parse messy real-world inputs (voice, text, image) into structured traffic alerts and live heatmaps.

## Features
- **Smart Input Parsing**: Convert natural language and images into structured traffic reports.
- **Live Dashboard**: Real-time traffic alerts and analytics overview.
- **Dynamic Mapping**: Visual overlays of congestion and accident hotzones.
- **Responsive UI**: Sleek dark-mode interface optimized for mobile usage.

## Folder Structure
- `traffic-assistant-frontend/`: Vite + React UI application.
- `traffic-assistant-backend/`: Node.js + Express + Gemini AI backend API.

---

## 🚀 Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and `npm` installed on your machine.
*(If you do not have Node.js installed, please download and install it first. The following `npm` commands will not work otherwise).*

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd traffic-assistant-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Rename `.env.example` to `.env`.
   - Add your [Google Gemini API Key](https://aistudio.google.com/app/apikey) and Firebase credentials.
4. Start the backend:
   ```bash
   npm run dev
   ```
   *(Server runs on port 5000).*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd traffic-assistant-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. *(Optional for production)* Add Google Maps API key inside your `.env` for map rendering.
4. Start the frontend:
   ```bash
   npm run dev
   ```
   *(App runs on http://localhost:5173).*

---

## 🌍 Deployment Guide

### Deploying the Frontend (Vercel)
The easiest way to deploy the React Vite app is [Vercel](https://vercel.com/):
1. Push the `traffic-assistant-frontend` folder to a GitHub repository.
2. Go to Vercel, and click **Add New Project**.
3. Import your repository, and set the Framework Preset to **Vite**.
4. Click **Deploy**.

### Deploying the Backend (Render or Google Cloud Run)
**Using Render:**
1. Push `traffic-assistant-backend` to GitHub.
2. On Render.com, create a new **Web Service**.
3. Connect your repo, set Build Command to `npm install`, and Start Command to `npm start`.
4. Add all environment variables (GEMINI_API_KEY, Firebase credentials) in Render's env setup.
5. Deploy.

---

*Note: For immediate showcase without backend, the frontend defaults to mock UI data demonstrating the traffic flow and AI parsing latency.*
