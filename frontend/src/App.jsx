// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Page imports
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ForecastPage } from './pages/ForecastPage';
import { VesselMatcherPage } from './pages/VesselMatcherPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { RouteOptimizerPage } from './pages/RouteOptimizerPage';
import { RiskCenterPage } from './pages/RiskCenterPage';
import { AlertsPage } from './pages/AlertsPage';
import { ScenarioPlannerPage } from './pages/ScenarioPlannerPage';
import { MarketIntelPage } from './pages/MarketIntelPage';
import { PortDatabasePage } from './pages/PortDatabasePage';
import { VesselDatabasePage } from './pages/VesselDatabasePage';
import { IdleManagementPage } from './pages/IdleManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { PresentationPage } from './pages/PresentationPage';

function App() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Presentation Full-Screen Deck */}
      <Route path="/presentation" element={<PresentationPage />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated Logistics Application Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/vessel-matcher" element={<VesselMatcherPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/routes" element={<RouteOptimizerPage />} />
        <Route path="/risk" element={<RiskCenterPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/scenarios" element={<ScenarioPlannerPage />} />
        <Route path="/market" element={<MarketIntelPage />} />
        <Route path="/ports" element={<PortDatabasePage />} />
        <Route path="/vessels" element={<VesselDatabasePage />} />
        <Route path="/idle" element={<IdleManagementPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
