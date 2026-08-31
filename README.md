# OCEANCHARTER AI
**"Predict Freight. Match Vessels. Reduce Demurrage."**

*Smart India Hackathon 2026 | Problem Statement ID: SIH26006*
*Organization: Ministry of Steel | Department: Steel Authority of India Limited (SAIL)*
*Category: Software | Theme: Transportation & Logistics*

---

## 🌊 Overview
OceanCharter AI is an enterprise maritime decision support platform specifically built for raw material procurement (e.g. coking coal, iron ore) from overseas origins (Australia, Indonesia, South Africa, USA) to India's East Coast ports (Haldia, Paradip, Dhamra, Visakhapatnam, Gangavaram, Gopalpur, Chennai, Kamarajar, Sagar/Sandheads).

---

## 🛠️ Mandatory Pure MERN Stack Architecture
Strictly developed with **Pure MERN Stack** (.jsx / .js / .css — No TypeScript, No Next.js, No Python runtime dependency for core inference).

### Frontend (`/frontend`)
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS & Glassmorphism Design System
- **Routing**: React Router DOM v6
- **Charts & Data Viz**: Recharts (Interactive Area, Line, Bar, and Donut charts)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **API Client**: Axios

### Backend (`/backend`)
- **Runtime**: Node.js & Express.js REST API
- **Security**: JWT Authentication, bcryptjs, Helmet, CORS
- **Database / ODM**: MongoDB with Mongoose Models & in-memory resilience fallback
- **Engines**: Pure JS Predictive Time-Series Forecasting, Feasibility Engine (10+ constraints), Demurrage Risk Engine (0–100), Total Landed Cost Engine, Multi-Criteria Optimization Engine, and Explainable AI (XAI).

---

## 🚀 Quick Start Guide

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm run seed     # Seeds 730 days synthetic freight time-series, 17 ports, fleet, and alerts
npm run dev      # Runs Express REST API on http://localhost:5000
```

### 2. Start the Frontend Vite Dev Server
```bash
cd frontend
npm install
npm run dev      # Runs React Vite UI on http://localhost:5173
```

---

## 🔑 Demo Login Credentials
- **Admin**: `admin@sail.gov.in` / `password123`
- **Procurement Manager**: `procurement@sail.gov.in` / `password123`
- **Logistics Manager**: `logistics@sail.gov.in` / `password123`
- **Market Analyst**: `analyst@sail.gov.in` / `password123`
- **Viewer / Observer**: `viewer@sail.gov.in` / `password123`

*(Alternatively, use the 1-Click Role Switcher or "RUN SIH DEMO" buttons on any page).*

---

## 🎯 Key Application Routes
- `/` — Premium Maritime Logistics Landing Page
- `/dashboard` — Enterprise Logistics Dashboard (8 Mandatory KPIs)
- `/forecast` — Freight Forecasting Engine (7, 14, 30, 60, 90-day horizons, EMA20/50, Volatility)
- `/vessel-matcher` — Vessel-Port Feasibility Engine & Alternative Generator
- `/calculator` — Chartering Cost & What-If Live Sensitivity Simulator
- `/routes` — Maritime Route Optimizer & Transit Corridor Visualizer
- `/risk` — Demurrage Risk Center (0–100 Index & Gauge)
- `/alerts` — Early Warning Radar
- `/scenarios` — Scenario Planner & Side-by-Side Tradeoff Matrix
- `/market` — Baltic Indices (BDI, BCI, BPI, BSI) & Bunker Prices
- `/ports` — 17 Port Specifications & Draught Database
- `/vessels` — Bulk Carrier Fleet & Vessel Class Envelopes
- `/idle` — Idle Vessel Management & Voyage Cycle Decomposition
- `/reports` — Printable Executive Decision Briefs & Audit Dossiers
- `/presentation` — Full-Screen 10-Step SIH Judge Presentation Mode

---

## ⚖️ Disclaimer
*OceanCharter AI is an SIH 2026 prototype. Operational constraints, freight rates, weather, congestion and cost figures shown in demo mode may be simulated or illustrative and must be verified against authoritative sources before commercial decisions.*
