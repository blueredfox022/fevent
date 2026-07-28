import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/public/HomePage";
import EventDetailPage from "../pages/public/EventDetailPage";
import RegistrationPage from "../pages/public/RegistrationPage";

import RegistrationSuccessPage from "../pages/public/RegistrationSuccessPage";
import DashboardPage from "../pages/admin/DashboardPage";

import EventPage from "../pages/admin/EventPage";
import CreateEventPage from "../pages/admin/CreateEventPage";

import ParticipantPage from "../pages/admin/ParticipantPage";
import ValidateQrPage from "../pages/admin/ValidateQrPage";
import CertificatePage from "../pages/admin/CertificatePage";
import EditEventPage from "../pages/admin/EditEventPage";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/admin/LoginPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/:id/register" element={<RegistrationPage />} />
        <Route
          path="/registration-success"
          element={<RegistrationSuccessPage />}
        />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <EventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/create"
          element={
            <ProtectedRoute>
              <CreateEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/:id/edit"
          element={
            <ProtectedRoute>
              <EditEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/:id/participants"
          element={
            <ProtectedRoute>
              <ParticipantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/validate-qr"
          element={
            <ProtectedRoute>
              <ValidateQrPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/certificates"
          element={
            <ProtectedRoute>
              <CertificatePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
